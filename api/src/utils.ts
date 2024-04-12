import { Context } from "hono";

export async function verify(ctx: Context) {
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
