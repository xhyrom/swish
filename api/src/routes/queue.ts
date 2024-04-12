import { Hono } from "hono";
import get from "./queue/get";
import post from "./queue/post";
import middleware from "./queue/middleware";

const app = new Hono();

app.use(middleware);

app.get("/", get);
app.post("/", post);

export default app;
