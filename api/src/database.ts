import { Context } from "hono";
import { Client } from "pg";
import type { Bindings } from ".";

export async function client(
  ctx: Context<{ Bindings: Bindings }>
): Promise<Client> {
  const c = new Client(ctx.env.POSTGRESQL_URL);
  await c.connect();

  return c;
}

export async function addSongToQueue(
  c: Client,
  id: string,
  from?: string,
  to?: string
) {
  return await c.query(
    "INSERT INTO queue (video_id, from_user, to_user) VALUES ($1, $2, $3)",
    [id, from, to]
  );
}
