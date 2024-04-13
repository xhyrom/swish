import { Hono } from "hono";
import put from "./access/put";
import del from "./access/delete";
import middleware from "./access/middleware";

const app = new Hono();

app.use(middleware);

app.put("/", put);
app.delete("/", del);

export default app;
