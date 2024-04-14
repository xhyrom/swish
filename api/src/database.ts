import { Context } from "hono";
import { Client } from "pg";
import type { Bindings } from ".";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  36
);

export async function client(
  ctx: Context<{ Bindings: Bindings }>
): Promise<Client> {
  const c = new Client(ctx.env.POSTGRESQL_URL);
  await c.connect();

  return c;
}

export async function enqueueTrack(
  c: Client,
  id: string,
  from?: string | null,
  to?: string | null
) {
  if (!from) from = null;
  if (!to) to = null;

  return await c.query(
    "INSERT INTO queue (video_id, from_user, to_user) VALUES ($1, $2, $3)",
    [id, from, to]
  );
}

export async function getQueue(c: Client) {
  const result = await c.query("SELECT * FROM queue");
  return result.rows;
}

export async function createReadUser(
  c: Client,
  ctx: Context<{ Bindings: Bindings }>
) {
  const password = nanoid();
  const until = new Date();
  until.setHours(until.getHours() + 24);
  const untilString = until.toISOString().split("T")[0];

  try {
    const result = await c.query(
      "SELECT FROM pg_catalog.pg_roles WHERE rolname = $1",
      [ctx.env.READ_USERNAME]
    );

    if (result.rows.length === 0) {
      await c.query(
        `CREATE USER ${ctx.env.READ_USERNAME} WITH PASSWORD '${password}' VALID UNTIL '${untilString}'`
      );
    } else {
      await c.query(
        `ALTER USER ${ctx.env.READ_USERNAME} WITH PASSWORD '${password}' VALID UNTIL '${untilString}'`
      );
    }

    await c.query(`GRANT SELECT ON queue TO ${ctx.env.READ_USERNAME}`);

    return {
      username: ctx.env.READ_USERNAME,
      password,
      expires: until,
    };
  } catch (e) {
    console.error(e);
  }

  ctx.status(500);
  return { message: "Failed to initialize read user." };
}

export async function deleteReadUser(
  c: Client,
  ctx: Context<{ Bindings: Bindings }>
) {
  try {
    await c.query(`REVOKE SELECT ON queue FROM ${ctx.env.READ_USERNAME}`);
    await c.query(`DROP USER ${ctx.env.READ_USERNAME}`);

    return { message: "User deleted." };
  } catch (e) {
    console.error(e);
  }

  ctx.status(500);
  return { message: "Failed to delete read user." };
}
