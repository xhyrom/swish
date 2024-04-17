package main

import (
	"context"
	"embed"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"github.com/xhyrom/swish/pkg/database"

	_ "github.com/joho/godotenv/autoload"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	// db connection
	creds := database.GetCredentials()
	db := database.NewDatabase(creds)
	defer db.Close()

	go listener(app, db)

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "app",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			db,
		},
	})


	if err != nil {
		println("Error:", err.Error())
	}
}


func establishConnectionAndListen(app *App, db *database.Database) (*pgxpool.Conn, error) {
	conn, err := db.Acquire(context.Background())
	if err != nil {
		return nil, fmt.Errorf("Error acquiring connection: %w", err)
	}

	_, err = conn.Exec(context.Background(), "LISTEN table_changes")
	if err != nil {
		return nil, fmt.Errorf("Error listen to table_changes: %w", err)
	}

	return conn, nil
}


func listener(app *App, db *database.Database) {
	conn, err := establishConnectionAndListen(app, db)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Start a goroutine to ping the database periodically
	go func() {
		for {
			// Acquire a new connection for pinging
			pingConn, err := db.Acquire(context.Background())
			if err != nil {
				fmt.Println("Error acquiring connection for ping:", err)
				continue
			}

			err = pingConn.Ping(context.Background())
			pingConn.Release() // Don't forget to release the connection when you're done

			if err != nil {
				fmt.Println("Lost connection to the database, reconnecting...")
				conn, err = establishConnectionAndListen(app, db)
				if err != nil {
					fmt.Println(err)
				} else {
					fmt.Println("Reconnected to the database.")
				}
			}
			time.Sleep(time.Minute) // Adjust the sleep duration to your needs
		}
	}()

	for {
		notification, err := conn.Conn().WaitForNotification(context.Background())
		if err != nil {
			fmt.Println("Error waiting for notification:", err)
			continue
		}

		fmt.Println("Received notification:", notification)
		runtime.EventsEmit(app.ctx, "table_changes", notification.Payload)
	}
}
