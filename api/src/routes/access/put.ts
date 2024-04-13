import { Context } from "hono";
import { Bindings } from "../..";
import { client, createReadUser } from "../../database";

export default async function (c: Context<{ Bindings: Bindings }>) {
  const db = await client(c);
  const user = await createReadUser(db, c);

  return c.json({
    ...user,
    host: c.env.POSTGRESQL_URL.split("@")[1].split("/")[0],
    database: c.env.POSTGRESQL_URL.split("/")[3],
  });
}
