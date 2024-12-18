package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string    `gorm:"not null, unique"`
	Hash     string    `gorm:"not null" json:"-"`
	Email    string    `gorm:"not null, unique"`
	Contacts []Contact `gorm:"foreignkey:SavedBy"`
}

type Contact struct {
	gorm.Model
	User    User `gorm:"foreignkey:ID" json:"user"`
	SavedBy User `gorm:"foreignkey:ID" json:"-"`
}

type Message struct {
	gorm.Model
	Text string `gorm:"not null"`
	From User   `gorm:"foreignkey:ID"`
	Chat Chat   `gorm:"foreignkey:ID"`
}

type Chat struct {
	gorm.Model
	Name     string    `gorm:"not null"`
	Users    []User    `gorm:"many2many:chats_users"`
	Messages []Message `gorm:"foreignkey:Chat"`
}
