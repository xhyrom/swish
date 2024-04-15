package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	_ "github.com/joho/godotenv/autoload"
	"github.com/xhyrom/swish/pkg/database"
)

func main() {
	fmt.Println("Hello, World!")

	creds := database.GetCredentials()
	fmt.Printf("Credentials are: %+v\n", creds)

	db := database.NewDatabase(creds)
	defer db.Close()

	queue := db.GetQueue()

	for _, track := range queue {
		fmt.Printf("Video ID: %s", track.VideoId)
		if track.From != nil {
			fmt.Printf(" from %s", *track.From)
		}
		if track.To != nil {
			fmt.Printf(" to %s", *track.To)
		}
		fmt.Println()
	}

	go listener(db) // Start the listener

	//player.Play()

	quitChannel := make(chan os.Signal, 1)
	signal.Notify(quitChannel, syscall.SIGINT, syscall.SIGTERM)
	<-quitChannel
	fmt.Println("Adios!")
}

func listener(db *database.Database) {
	conn, err := db.Acquire(context.Background())

	if err != nil {
		fmt.Println("Error acquiring connection:", err)
		return
	}

	_, err = conn.Exec(context.Background(), "LISTEN table_changes")
	if err != nil {
		fmt.Println("Error listen to table_changes:", err)
		return
	}

	for {
		notification, err := conn.Conn().WaitForNotification(context.Background())
		if err != nil {
			fmt.Println("Error waiting for notification:", err)
			continue
		}

		fmt.Println("Received notification:", notification)
	}
}