import { Context, Hono } from "hono";
import userRouter from "@/routes/userRoutes";
const app = new Hono();

app.route("/users", userRouter);

app.get("/", (c: Context) => c.text("Hello Hono!"));

export default app;
