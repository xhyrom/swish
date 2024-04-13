import { Context } from "hono";
import { Bindings } from "../..";

export default async function (c: Context<{ Bindings: Bindings }>) {
  const identifier = c.req.query("q");

  if (!identifier) {
    return c.json({ message: "Missing identifier" }, 400);
  }

  const res = await fetch(
    `${c.env.LAVALINK_URL}/loadtracks?identifier=${encodeURIComponent(
      identifier
    )}`,
    {
      headers: {
        Authorization: c.env.LAVALINK_PASSWORD,
      },
    }
  );

  if (!res.ok) {
    return c.json({ message: "Failed to load tracks" }, 500);
  }

  const data = (await res.json()) as {
    data: {}[];
  };

  if (!data?.data?.length) {
    return c.json({ message: "No tracks found" }, 404);
  }

  return c.json(data.data);
}
