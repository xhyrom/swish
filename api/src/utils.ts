import { Context } from "hono";
import type { Bindings } from ".";

export async function verify(ctx: Context<{ Bindings: Bindings }>) {
  const body = await ctx.req.parseBody();

  const token = body["cf-turnstile-response"];
  const ip = ctx.req.header("CF-Connecting-IP");

  const formData = new FormData();

  formData.append("secret", ctx.env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    }
  );

  const outcome = (await response.json()) as {
    success: boolean;
  };

  return outcome?.success;
}

export async function videoExists(id: string) {
  if (!/^[a-z0-9_-]{11}$/gi.test(id)) {
    return false;
  }

  const res = await fetch(
    `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}`
  );

  return res.ok;
}
