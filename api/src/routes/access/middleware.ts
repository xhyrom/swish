import { Context, Next } from "hono";
import { Bindings } from "../..";
import { basicAuth } from "hono/basic-auth";

export default async function (c: Context<{ Bindings: Bindings }>, next: Next) {
  return basicAuth({
    username: c.env?.USERNAME,
    password: c.env?.PASSWORD,
  })(c, next);
}
