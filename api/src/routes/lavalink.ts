import { Hono } from "hono";
import search from "./lavalink/search";
import middleware from "./lavalink/middleware";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors());
app.use(middleware);

app.get("/search", search);

export default app;
