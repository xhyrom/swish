import { Hono } from "hono";
import get from "./queue/get";
import post from "./queue/post";
import middleware from "./queue/middleware";
import { cors } from "hono/cors";

const app = new Hono();

app.use(middleware);
app.use(cors());

app.get("/", get);
app.post("/", post);

export default app;
