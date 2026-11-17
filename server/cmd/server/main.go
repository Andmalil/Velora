package main

import (
	"log"

	"github.com/Andmalil/Velora/server/internal/app"
)

func main() {
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
