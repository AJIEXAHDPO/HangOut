package main

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/websocket"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	*gorm.Model
	ID    uint `gorm:"primaryKey"`
	Hash  string
	Name  string `gorm:"unique"`
	Email string `gorm:"unique"`
}

type Offer map[string]interface{}
type Answer map[string]interface{}

type ConnectionMessage struct {
	TargetID uint   `json:"targetId"`
	Payload  string `json:"payload"`
	Type     string `json:"type"`
}

type AuthRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

var DB *gorm.DB
var SQL_DB *sql.DB
var upgrader = websocket.Upgrader{
	WriteBufferSize: 1024,
	ReadBufferSize:  1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type UserInfo struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type UserClaims struct {
	*jwt.StandardClaims
	UserInfo
	TokenType string
}

type UserConnections struct {
	UserID      string
	Connections []*websocket.Conn
}

// adds cors headers to a response
func addCorsHeaders(w http.ResponseWriter) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Add("Access-Control-Allow-Credentials", "true")
}

var (
	privateKey []byte
	publicKey  []byte
)

var clients map[uint][]*websocket.Conn
var mutex sync.Mutex

// Signalling controller.
// Sends offers and answers to the clients
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	addCorsHeaders(w)

	con, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("failed to upgrade connection", err)
	}
	defer con.Close()
	var user = r.Context().Value(&UserClaims{}).(*UserClaims)
	go addConn(user.UserInfo.ID, con, &mutex)

	for {
		var buff ConnectionMessage
		if err := con.ReadJSON(&buff); err != nil {
			log.Println("failed to read message", err)
			break
		}
		go sendTo(buff.TargetID, buff, &mutex)
	}
}

// send to client
func sendTo(userID uint, message ConnectionMessage, mutex *sync.Mutex) {
	mutex.Lock()
	for _, con := range clients[userID] {
		if err := con.WriteJSON(message); err != nil {
			log.Println("failed to send json:", err)
		}
	}
	mutex.Unlock()
}

// add connection
func addConn(userID uint, conn *websocket.Conn, mutex *sync.Mutex) {
	mutex.Lock()
	clients[userID][len(clients[userID])] = conn
	mutex.Unlock()
}

// register
func register(w http.ResponseWriter, r *http.Request) {
	addCorsHeaders(w)

	// check Content-Type
	contentType := r.Header.Get("Content-Type")
	if contentType != "application/json" {
		log.Println(contentType)
		log.Println("error", http.StatusUnsupportedMediaType, "Content-Type: application/json is required")
		http.Error(w, "Content-Type: application/json is required", http.StatusUnsupportedMediaType)
	}

	decoder := json.NewDecoder(r.Body)
	var req RegisterRequest
	if err := decoder.Decode(&req); err != nil {
		log.Println("error", http.StatusBadRequest, "vaildation failed")
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	hash := sha256.Sum256([]byte(req.Password))
	// if err := DB.Model(&User{}).Create(User{
	// 	Name:  req.Name,
	// 	Hash:  hex.EncodeToString(hash[:]),
	// 	Email: req.Email,
	// }).Error; err != nil {
	// 	log.Println("error", http.StatusBadRequest, "failed to create user")
	// 	http.Error(w, "bad request", http.StatusBadRequest)
	// 	return
	// }
	log.Println("created", hex.EncodeToString(hash[:]))
	w.WriteHeader(http.StatusCreated)
	w.Header().Add("Content-Type", "application/json")
	w.Write([]byte("{\"message\": \"created\"}"))
}

// auth
func auth(w http.ResponseWriter, r *http.Request) {
	addCorsHeaders(w)

	// check Content-Type
	contentType := r.Header.Get("Content-Type")
	if contentType != "application/json" {
		log.Println(contentType)
		log.Println("error", http.StatusUnsupportedMediaType, "Content-Type: application/json is required")
		http.Error(w, "Content-Type: application/json is required", http.StatusUnsupportedMediaType)
	}

	decoder := json.NewDecoder(r.Body)
	var req AuthRequest
	if err := decoder.Decode(&req); err != nil {
		log.Println("error", http.StatusBadRequest, "bad request")
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	hash := sha256.Sum256([]byte(req.Password))
	var user User
	if err := DB.Model(&User{}).Where("name = ?", req.Name).First(&user).Error; err != nil {
		log.Println("error", http.StatusForbidden, "authentication failed: no such user with that name")
		http.Error(w, "authentication failed: no such user with that name", http.StatusForbidden)
		return
	}

	if user.Hash != hex.EncodeToString(hash[:]) {
		log.Println("error", http.StatusForbidden, hex.EncodeToString(hash[:]), "=", user.Hash)
		http.Error(w, "authentication failed: incorrect user name or password", http.StatusForbidden)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")

	token, err := createToken(user)
	if err != nil {
		log.Println("error", http.StatusForbidden, "failed to generate token for user, try again", err)
		http.Error(w, "failed to generate token for user, try again", http.StatusForbidden)
		return
	}
	res, err := json.Marshal(map[string]string{
		"token": token,
	})
	if err != nil {
		log.Println("error", http.StatusForbidden, "failed to marshal json string, try again")
		http.Error(w, "failed to marshal json string, try again", http.StatusForbidden)
		return
	}
	w.Write(res)
}

// create jwt token for user
func createToken(user User) (string, error) {
	token := jwt.New(jwt.SigningMethodRS256)
	token.Claims = &UserClaims{
		&jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
		UserInfo{
			user.ID,
			user.Name,
			user.Email,
		},
		"auth",
	}
	privateKeyParsed, err := jwt.ParseRSAPrivateKeyFromPEM(privateKey)
	if err != nil {
		return "", err
	}

	tokenStr, err := token.SignedString(privateKeyParsed)
	if err != nil {
		return "", err
	}
	return tokenStr, nil
	// return token.SignedString(privateKey)
}

// auth middleware
func checkAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		addCorsHeaders(w)

		auth := r.Header.Get("Authorisation")
		tokenStr, found := strings.CutPrefix(auth, "Bearer ")
		if !found {
			log.Println("error", http.StatusForbidden, "no token provided")
			http.Error(w, "no token provided", http.StatusForbidden)
			return
		}
		token, err := vaildateToken(tokenStr)
		if err != nil {
			log.Println("validation failed:", err)
			log.Println("error", http.StatusBadRequest, "validation failed")
			http.Error(w, err.Error(), http.StatusForbidden)
			return
		}

		claims, ok := token.Claims.(*UserClaims)
		if !ok {
			log.Println("error", http.StatusForbidden, "Not validid json token")
			http.Error(w, "Not validid json token", http.StatusForbidden)
		}
		log.Println("auth token is:", tokenStr)
		ctx := context.WithValue(r.Context(), &UserClaims{}, claims)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	}
}

// checks if it is the valid token
func vaildateToken(tokenString string) (*jwt.Token, error) {
	publicKeyParsed, err := jwt.ParseRSAPrivateKeyFromPEM(publicKey)
	if err != nil {
		return nil, err
	}
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("invalid algorithm")
		}
		return publicKeyParsed, nil
	})
	if err != nil {
		return nil, err
	}

	return token, nil
}

// connect database
func init() {
	dbhost := "localhost"
	dbuser := "postgres"
	dbname := "course_work"
	dbport := "5432"
	dbpass := "postgres"
	dbConStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Moscow", dbhost, dbuser, dbpass, dbname, dbport)
	con, err := gorm.Open(postgres.Open(dbConStr))
	if err != nil {
		log.Fatalln("failed to connect db", err)
	}
	DB = con
	SQL_DB, _ = con.DB()

	// init database
	if err := DB.Migrator().AutoMigrate(User{}); err != nil {
		log.Fatalln("faied to migrate database", err)
	}

	// @todo
	// create test user, remove in production
	var user User
	hash := sha256.Sum256([]byte("12345aA"))
	if err := DB.Model(&User{
		ID: 1,
	}).Attrs(&User{
		Name:  "testUser",
		Email: "alesha.iv03@gmail.com",
		Hash:  hex.EncodeToString(hash[:]),
	}).FirstOrCreate(&user).Error; err != nil {

	}
	DB.Save(&user)
	// public key
	publicKey, err = os.ReadFile("./secrets/public_key.pem")
	if err != nil {
		log.Fatalln("failed to read pub key")
	}

	// private key
	privateKey, err = os.ReadFile("./secrets/private_key.pem")
	if err != nil {
		log.Fatalln("failed to read pub key")
	}
}

func main() {
	http.HandleFunc("/ws", checkAuth(handleWebSocket))
	http.HandleFunc("/register", register)
	http.HandleFunc("/auth", auth)
	log.Println("server is listening on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
