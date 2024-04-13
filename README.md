**Swish** stands for **Song Wish**, it's a web application that allows users to search for songs and submit them to a queue. The queue is handled by an app that runs on a computer.

Built on top of [Cloudflare Workers](https://workers.cloudflare.com/), [Cloudflare Pages](https://pages.cloudflare.com/), [PostgreSQL](https://www.postgresql.org/) using [Pants](https://www.pantsbuild.org/), [TypeScript](https://www.typescriptlang.org/), [Go](https://golang.org/) and [Astro](https://astro.build/) for GKŠM.

## Requirements

- [pants](https://www.pantsbuild.org/)
- [node.js](https://nodejs.org/)
- [pnpm](https://pnpm.js.org/)
- [golang](https://golang.org/)

## Structure

- `page/` contains the web application, written in Astro.
- `api/` contains the worker that handles requests from the web application and adds them to the queue, written in TypeScript.
- `app/` contains the app that handles the queue, written in Go.