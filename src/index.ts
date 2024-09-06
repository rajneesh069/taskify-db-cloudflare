import { Context, Hono } from "hono";
import users from "@/routes/userRoutes";
import todos from "@/routes/todoRoutes";

const app = new Hono();
// todo : add CORS
// app.use("*", async (c, next) => {
//   c.header("Access-Control-Allow-Origin", "http://localhost:8080");
//   c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   c.header("Access-Control-Allow-Headers", "Content-Type");
//   await next();
// });

app.route("/users", users);
app.route("/todos", todos);


/* Health Check Route */
app.get("/", (c: Context) => c.text("Hello Hono!"));

export default app;
