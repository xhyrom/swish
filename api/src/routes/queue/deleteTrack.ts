import { Context } from "hono";
import { Bindings } from "../..";
import { client, deleteTrack } from "../../database";

export default async function (c: Context<{ Bindings: Bindings }>) {
  const id = c.req.param("id");

  const db = await client(c);
  const result = await deleteTrack(db, id);

  c.status(result.rowCount === 1 ? 200 : 400);
  return c.json(
    result.rowCount === 1
      ? { message: "Track removed from queue." }
      : { message: "Failed to remove track from queue." }
  );
}
