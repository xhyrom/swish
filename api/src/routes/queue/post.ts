import { Context } from "hono";
import { Bindings } from "../..";
import { enqueueTrack, client } from "../../database";
import { videoExists } from "../../utils";

export default async function (c: Context<{ Bindings: Bindings }>) {
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

  if (!(await videoExists(id))) {
    return c.json({ message: "Video with this id does not exist." }, 400);
  }

  if (from && typeof from !== "string") {
    return c.json({ message: "Option from should be a string" }, 400);
  }

  if (to && typeof to !== "string") {
    return c.json({ message: "Option to should be a string" }, 400);
  }

  const db = await client(c);
  const result = await enqueueTrack(db, id, from, to);

  c.executionCtx.waitUntil(db.end());
  return c.json(
    result
      ? { message: "Song added to queue." }
      : { message: "Failed to add song to queue." }
  );
}
