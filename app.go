package main

import (
	"context"
    "crypto/rand"
    "encoding/hex"
    "os"
    "path/filepath"
)

// App struct
type App struct {
	ctx    context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// GetToken returns the authorization token, generating it if necessary.
func (a *App) GetToken() string {
    home, err := os.UserHomeDir()
    if err != nil {
        return ""
    }
    configDir := filepath.Join(home, ".config", "lugovpn")
    tokenPath := filepath.Join(configDir, "token")

    // Try to read
    if data, err := os.ReadFile(tokenPath); err == nil {
        return string(data)
    }

    // Generate new
    // Ensure dir exists
    _ = os.MkdirAll(configDir, 0700)
    
    bytes := make([]byte, 32)
    if _, err := rand.Read(bytes); err != nil {
        return ""
    }
    token := hex.EncodeToString(bytes)
    
    // Save
    _ = os.WriteFile(tokenPath, []byte(token), 0600)
    
    return token
}
