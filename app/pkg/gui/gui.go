package gui

import (
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

func NewApp() {
	myApp := app.New()
	myWindow := myApp.NewWindow("Hello")

	hello := widget.NewLabel("Hello Fyne!")
	myWindow.SetContent(container.NewVBox(
		hello,
		widget.NewButton("Hi!", func() {
			hello.SetText("Welcome :)")
		}),
	))

	myWindow.ShowAndRun()
}