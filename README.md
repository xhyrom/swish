**Swish** stands for **Song Wish**, it's a web application that allows users to search for songs and add submit them to a queue. The queue is handled by an app that runs on a computer.

## Requirements

- [pants](https://www.pantsbuild.org/)
- [node.js](https://nodejs.org/)
- [pnpm](https://pnpm.js.org/)
- [golang](https://golang.org/)

## Structure

- `page/` contains the web application, written in Astro.
- `api/` contains the worker that handles requests from the web application and adds them to the queue, written in TypeScript.
- `app/` contains the app that handles the queue, written in Go.