import { Hono } from "hono";
import queue from "./routes/queue";

export type Bindings = {
  TURNSTILE_SECRET_KEY: string;
  POSTGRESQL_URL: string;
  USERNAME: string;
  PASSWORD: string;
  DEV?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  return c.json({ message: "Hello, World!" });
});

app.route("/queue", queue);

export default app;
