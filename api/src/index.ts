import { Hono } from "hono";
import { verify } from "./utils";
import { addSongToQueue, client } from "./database";

export type Bindings = {
  TURNSTILE_SECRET_KEY: string;
  POSTGRESQL_URL: string;
  DEV?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  return c.json({ message: "Hello, World!" });
});

app.use("/queue", async (c, next) => {
  if (c.env?.DEV === "true") return next();

  if (!(await verify(c))) {
    return c.json({ message: "Failed to verify." }, 403);
  }

  return next();
});

app.post("/queue", async (c) => {
  const body = await c.req.parseBody();

  const id = body["id"]; // id from youtube
  const from = body?.["from"]; // name of the person who is dedicating the song, optional
  const to = body?.["to"]; // name of the person for whom the song is dedicated, optional

  if (!id) {
    return c.json({ message: "Missing id." }, 400);
  }

  if (typeof id !== "string" || !/^[a-z0-9_-]{11}$/gi.test(id)) {
    return c.json({ message: "Invalid id." }, 400);
  }

  if (from && typeof from !== "string") {
    return c.json({ message: "Option from should be a string" }, 400);
  }

  if (to && typeof to !== "string") {
    return c.json({ message: "Option to should be a string" }, 400);
  }

  const db = await client(c);
  const result = await addSongToQueue(db, id, from, to);

  c.executionCtx.waitUntil(db.end());
  return c.json(
    result
      ? { message: "Song added to queue." }
      : { message: "Failed to add song to queue." }
  );
});

export default app;
