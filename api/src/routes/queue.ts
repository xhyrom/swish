import { Hono } from "hono";
import get from "./queue/get";
import post from "./queue/post";
import deleteTrack from "./queue/deleteTrack";
import middleware from "./queue/middleware";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors());
app.use(middleware);

app.get("/", get);
app.post("/", post);
app.delete("/:id", deleteTrack);

export default app;
