package main

import (
	"embed"
	"fmt"
	"net/http"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

var globalApp *App

func main() {
	// Create an instance of the app structure
	globalApp = NewApp()

	// Start local token server (Desktop only)
	go startTokenServer()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "lugovpn-desktop",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        globalApp.startup,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

// Local HTTP server for token bootstrap (Desktop only)
func startTokenServer() {
	http.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		token := globalApp.GetToken()
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte(token))
	})
	
	fmt.Println("[Desktop] Token server listening on :17824")
	http.ListenAndServe(":17824", nil)
}
