import { Hono } from "hono";
import queue from "./routes/queue";
import access from "./routes/access";
import lavalink from "./routes/lavalink";

export type Bindings = {
  TURNSTILE_SECRET_KEY: string;
  POSTGRESQL_URL: string;
  USERNAME: string;
  PASSWORD: string;
  READ_USERNAME: string;
  LAVALINK_URL: string;
  LAVALINK_PASSWORD: string;
  DEV?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  return c.json({ message: "Hello, World!" });
});

app.route("/queue", queue);
app.route("/access", access);
app.route("/lavalink", lavalink);

export default app;
