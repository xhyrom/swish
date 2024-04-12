import { Context } from "hono";
import { Bindings } from "../..";
import { client, getQueue } from "../../database";

export default async function (c: Context<{ Bindings: Bindings }>) {
  const db = await client(c);
  const result = await getQueue(db);

  c.executionCtx.waitUntil(db.end());
  return c.json(result);
}
