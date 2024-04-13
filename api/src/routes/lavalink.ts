import { Hono } from "hono";
import search from "./lavalink/search";
import middleware from "./lavalink/middleware";

const app = new Hono();

app.use(middleware);

app.get("/search", search);

export default app;
