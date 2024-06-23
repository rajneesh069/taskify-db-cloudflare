import { Context, Hono } from "hono";
import { createUser, getUsers } from "./db/userQueries";

const app = new Hono();

app.get("/", async (c: Context) => {
  const res = await getUsers("rajneesh@gmail.com", c);
  console.log("res  :", res);
  return c.json({ res });
});

export default app;
