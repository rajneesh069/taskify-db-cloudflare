import { getPrisma } from "@/db/prismaFunction";
import { Context, Hono } from "hono";
const app = new Hono();

import { z } from "zod";

const todoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be at most 300 characters long"),
  description: z
    .string()
    .max(600, "Description must be at most 600 characters long")
    .optional(),
  isComplete: z.boolean(),
  userId: z.string().uuid(),
  tags: z.array(z.string()),
});

// get all the todos for a given user Id
app.get("/:userId", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.req.param("userId");
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },
    });
    if (todos.length == 0) {
      return c.json({ message: "No Todos Found", todos }, { status: 404 });
    }
    return c.json({ message: "Todos Found", todos }, { status: 200 });
  } catch (error) {
    return c.json({ message: "Database Error", error: error }, { status: 500 });
  }
});

// create a todo given a user id
app.post("/create", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const result = todoSchema.safeParse(await c.req.json());
  if (!result.success) {
    return c.json(
      { message: "Invalid Todo Data", error: result.error.errors },
      { status: 403 }
    );
  }
  try {
    const todo = await prisma.todo.create({
      data: result.data,
      select: {
        id: true,
        title: true,
        description: true,
        isComplete: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: true,
      },
    });
    return c.json({ message: "Todo Created", todo }, { status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Couldn't Create Todo" }, { status: 500 });
  }
});

// get a particular todo given a todo Id
app.get("/:todoId", async (c: Context) => {
  const todoId = c.req.param("todoId");
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const todo = prisma.todo.findFirst({
      where: {
        id: todoId,
      },
    });
    if (!todo) {
      return c.json({ message: "Todo Not Found", todo }, { status: 404 });
    }
    return c.json({ message: "Todo Found", todo }, { status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Database Error", error }, { status: 500 });
  }
});

// edit/update a particular todo given a todo Id
app.put("/:todoId", async (c: Context) => {
  const todoId = c.req.param("todoId");
  const prisma = getPrisma(c.env.DATABASE_URL);
  const result = todoSchema.safeParse(await c.req.json());
  if (!result.success) {
    return c.json(
      { message: "Invalid Todo Data", error: result.error.errors },
      { status: 403 }
    );
  }
  try {
    const todo = prisma.todo.update({
      where: {
        id: todoId,
        userId: result.data.userId,
      },
      data: result.data,
    });
    return c.json({ message: "Todo Updated.", todo }, { status: 200 });
  } catch (error) {
    console.error(error);
    return c.json(
      { message: "Database Error, couldn't update.", error },
      { status: 500 }
    );
  }
});

// remove a particular todo given a todo Id
app.delete("/:todoId", async (c: Context) => {
  const todoId = c.req.param("todoId");
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const todo = prisma.todo.delete({
      where: {
        id: todoId,
      },
    });
    return c.json({ message: "Todo Deleted", todo }, { status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Can't Delete Todo.", error }, { status: 500 });
  }
});

export default app;
