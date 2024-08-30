import { Context, Hono } from "hono";
import { getPrisma } from "./db/prismaFunction";
import { User } from "@prisma/client";
const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

app.post("/createUser", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userData: User = await c.req.parseBody();
  if (!userData) {
    return c.json({ message: "Invalid User Data" }, { status: 403 });
  }
  try {
    const user = await prisma.user.create({
      data: userData,
      include: {
      },
    });
    return c.json({ user }, { status: 200 });
  } catch (error) {
    return c.json({ message: "Error registering the user." }, { status: 500 });
  }
});

export default app;
