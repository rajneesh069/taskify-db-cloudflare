import { Context, Hono } from "hono";
import { getUser } from "./db/userQueries";
import { logger } from "hono/logger";

const app = new Hono();
app.use("*", logger());

app.get("/getUser", async (c: Context) => {
  const res = await getUser({ email: "rajneesh@gmail.com" }, c);
  return c.json({ res });
});

export default app;
