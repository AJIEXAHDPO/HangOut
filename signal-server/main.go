package main

import (
	"crypto/rsa"
	"crypto/sha256"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/websocket"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	*gorm.Model
	Hash  [32]byte
	Name  string `gorm:"unique"`
	Email string `gorm:"unique"`
}

type Offer map[string]interface{}
type Answer map[string]interface{}

type ConnectionMessage struct {
	TargetID string `json:"targetId"`
	Payload  string `json:"payload"`
	Type     string `json:"type"`
}

type AuthRequest struct {
	Name     string `json:"name"`
	Password string `json:"email"`
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

var privateKey *rsa.PrivateKey

var Connections map[string]*UserConnections

// Signalling controller.
// Sends offers and answers to the clients
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	con, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("failed to upgrade connection", err)
	}
	defer con.Close()

	for {
		var buff ConnectionMessage
		if err := con.ReadJSON(&buff); err != nil {
			log.Println("failed to read message", err)
			break
		}
		sendTo(buff.TargetID, buff)
	}
}

// send to client
func sendTo(userID string, message ConnectionMessage) {}

// register
func register(w http.ResponseWriter, r *http.Request) {
	// check Content-Type
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
	}
	contentType := http.DetectContentType(bytes)
	if contentType != "application/json" {
		http.Error(w, "Content-Type: application/json is required", http.StatusUnsupportedMediaType)
	}

	decoder := json.NewDecoder(r.Body)
	var req RegisterRequest
	if err := decoder.Decode(&req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	hash := sha256.Sum256([]byte(req.Password))
	if err := DB.Model(&User{}).Create(User{Name: req.Name, Hash: hash, Email: req.Email}).Error; err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusCreated)
	w.Header().Add("Content-Type", "application/json")
	w.Write([]byte("{\"message\": \"created\"}"))
}

// auth
func auth(w http.ResponseWriter, r *http.Request) {
	// check Content-Type
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
	}
	contentType := http.DetectContentType(bytes)
	if contentType != "application/json" {
		http.Error(w, "Content-Type: application/json is required", http.StatusUnsupportedMediaType)
	}

	decoder := json.NewDecoder(r.Body)
	var req AuthRequest
	if err := decoder.Decode(&req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	hash := sha256.Sum256([]byte(req.Password))
	var user User
	if err := DB.Model(&User{}).First(&user).Where("name = ?", req.Name).Error; err != nil {
		http.Error(w, "authentication failed: no such user with that name", http.StatusForbidden)
		return
	}

	if user.Hash != hash {
		http.Error(w, "authentication failed: incorrect user name or password", http.StatusForbidden)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")

	token, err := createToken(user)
	if err != nil {
		http.Error(w, "failed to generate token for user, try again", http.StatusForbidden)
		return
	}
	res, err := json.Marshal(map[string]string{
		"token": token,
	})
	if err != nil {
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
			user.Name,
			user.Email,
		},
		"auth",
	}
	return token.SignedString(privateKey)
}

// auth middleware
func checkAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorisation")
		token, found := strings.CutPrefix(auth, "Bearer ")
		if !found {
			http.Error(w, "no token provided", http.StatusForbidden)
			return
		}
		if _, err := vaildateToken(token); err != nil {
			http.Error(w, err.Error(), http.StatusForbidden)
			return
		}

		log.Println("auth token is:", token)
		next.ServeHTTP(w, r)
	}
}

// checks if it is the valid token
func vaildateToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("invalid algorithm")
		}
		return privateKey, nil
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
	dbpass := "12345aA"
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
}

func main() {
	http.HandleFunc("/ws/{userID}", checkAuth(handleWebSocket))
	http.HandleFunc("/register", register)
	http.HandleFunc("/auth", auth)
	log.Println("server is listening on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
