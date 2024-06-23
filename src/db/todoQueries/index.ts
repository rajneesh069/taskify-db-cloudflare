import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
const getPrisma = (database_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
  }).$extends(withAccelerate());
  return prisma;
};

type AddTodo = {
  title: string;
  description: string;
  userId: number;
};

type UpdateTodo = AddTodo & { todoId: number };

export async function addTodo(
  { title, description, userId }: AddTodo,
  c: Context
) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const addedTodo = await todo.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return addedTodo;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTodo({ todoId }: { todoId: number }, c: Context) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const todoDetails = await todo.findFirst({
      where: {
        id: todoId,
      },
    });
    return todoDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTodosForAParticularUser(
  { userId }: { userId: number },
  c: Context
) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const todos = await todo.findMany({
      where: {
        userId,
      },
    });
    return todos;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTodo(
  { title, description, userId, todoId }: UpdateTodo,
  c: Context
) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const updatedTodo = await todo.update({
      where: {
        id: todoId,
        userId, //not necessary to use it, I am using it anyway
      },
      data: {
        title,
        description,
      },
    });
    return updatedTodo;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTodo(
  {
    todoId,
    userId,
  }: {
    todoId: number;
    userId: number;
  },
  c: Context
) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const deletedTodo = await todo.delete({
      where: {
        id: todoId,
        userId,
      },
    });
    return deletedTodo;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
