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
}

func GetCredentials() Credentials {
	var creds Credentials
	
	err := requests.
		URL(fmt.Sprintf("%s/access", os.Getenv("API_URL"))).
		Method("PUT").
		BasicAuth("admin", "admin").
		ToJSON(&creds).
		Fetch(context.Background())

	if err != nil {
		panic(err)
	}

	return creds
}