import getPrisma from "../prisma";
import { Context } from "hono";

type AddTodo = {
  title: string;
  description: string;
  email: string;
  done: boolean;
};

type UpdateTodo = AddTodo & { todoId: number };

export async function addTodo(
  { title, description, email, done }: AddTodo,
  c: Context
) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const addedTodo = await todo.create({
      data: {
        title,
        description,
        done,
        email,
      },
    });

    return addedTodo || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTodos({ email }: { email: string }, c: Context) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const todos = await todo.findMany({
      where: {
        email,
      },
    });
    return todos || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTodo(
  { title, description, todoId, email, done }: UpdateTodo,
  c: Context
) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const updatedTodo = await todo.update({
      where: {
        id: todoId,
        email,
      },
      data: {
        title,
        description,
        done,
      },
    });
    return updatedTodo || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTodo(
  {
    todoId,
    email,
  }: {
    todoId: number;
    email: string;
  },
  c: Context
) {
  try {
    const { todo } = getPrisma(c.env.DATABASE_URL);
    const deletedTodo = await todo.delete({
      where: {
        id: todoId,
        email,
      },
    });
    return deletedTodo || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
