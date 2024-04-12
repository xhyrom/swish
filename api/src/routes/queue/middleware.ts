import { Context, Next } from "hono";
import { Bindings } from "../..";
import { verify } from "../../utils";
import { basicAuth } from "hono/basic-auth";

export default async function (c: Context<{ Bindings: Bindings }>, next: Next) {
  if (c.req.method === "GET") {
    return basicAuth({
      username: c.env?.USERNAME,
      password: c.env?.PASSWORD,
    })(c, next);
  }

  if (c.env?.DEV === "true") return next();

  if (!(await verify(c))) {
    return c.json({ message: "Failed to verify." }, 403);
  }

  return next();
}
