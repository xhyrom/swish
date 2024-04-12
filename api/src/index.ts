import { Hono } from "hono";
import { verify } from "./utils";

type Bindings = {
  TURNSTILE_SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/", async (c, next) => {
  if (!(await verify(c))) {
    return c.json({ message: "Failed to verify." }, 403);
  }

  return next();
});

app.get("/", async (c) => {
  return c.json({ message: "Hello, World!" });
});

export default app;
