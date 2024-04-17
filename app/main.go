package main

import (
	"context"
	"embed"
	"fmt"

	"github.com/jackc/pgx/v5/pgconn"
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
	ctx := context.Background()
	defer db.Close()

	go listen(app, ctx, db)

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

func listen(app *App, ctx context.Context, db *database.Database) {
	for {
		con, err := db.Acquire(ctx)
		if err != nil {
			fmt.Println("Error acquiring connection:", err)
			return
		}

		con.Conn().Exec(ctx, "LISTEN table_changes")

		n, _ := con.Conn().WaitForNotification(ctx)

		go func(n *pgconn.Notification) {
			poolCon, _ := db.Acquire(ctx)
			handleNotification(app, n)
			poolCon.Release()
		}(n)
	}
}

func handleNotification(app *App, notification *pgconn.Notification) {
	if notification == nil {
		return // no notification received
	}

	fmt.Println("Received notification:", notification)
	runtime.EventsEmit(app.ctx, "table_changes", notification.Payload)
}
