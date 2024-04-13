import { Context } from "hono";
import { Bindings } from "../..";
import { client, deleteReadUser } from "../../database";

export default async function (c: Context<{ Bindings: Bindings }>) {
  const db = await client(c);
  const result = await deleteReadUser(db, c);

  return c.json(result);
}
