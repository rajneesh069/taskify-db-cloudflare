import { Context, Hono } from "hono";
import userRouter from "@/routes/userRoutes";
import todoRouter from "@/routes/todoRoutes";

const app = new Hono();

app.route("/users", userRouter);
app.route("/todos", todoRouter);

/* Health Check Route */
app.get("/", (c: Context) => c.text("Hello Hono!"));

export default app;
