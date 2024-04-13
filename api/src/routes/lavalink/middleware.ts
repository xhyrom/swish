import { Context, Next } from "hono";
import { Bindings } from "../..";
import { verify } from "../../utils";

export default async function (c: Context<{ Bindings: Bindings }>, next: Next) {
  if (c.env?.DEV === "true") return next();

  if (!(await verify(c))) {
    return c.json({ message: "Failed to verify." }, 403);
  }

  return next();
}
