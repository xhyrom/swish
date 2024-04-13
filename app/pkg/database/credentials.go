package database

import (
	"context"
	"fmt"
	"os"

	"github.com/carlmjohnson/requests"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Host 	 string `json:"host"`
	Database string `json:"database"`
}

func GetCredentials() Credentials {
	var creds Credentials
	
	err := requests.
		URL(fmt.Sprintf("%s/access", os.Getenv("API_URL"))).
		Method("PUT").
		BasicAuth(os.Getenv("USERNAME"), os.Getenv("PASSWORD")).
		ToJSON(&creds).
		Fetch(context.Background())

	if err != nil {
		panic(err)
	}

	return creds
}

func (c Credentials) ConnectionString() string {
	return fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", c.Username, c.Password, c.Host, c.Database)
}