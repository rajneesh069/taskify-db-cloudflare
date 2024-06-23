import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
const getPrisma = (database_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
  }).$extends(withAccelerate());
  return prisma;
};

type CreateUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export async function createUser(
  { email, password, firstName, lastName, phoneNumber }: CreateUser,
  c: Context
) {
  const { user } = getPrisma(c.env.DATABASE_URL);
  const res = await user.create({
    data: {
      email,
      firstName,
      lastName,
      password,
      phoneNumber,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return res;
}

export async function updateUser(
  email: string,
  { firstName, lastName }: { firstName: string; lastName: string },
  c: Context
) {
  const { user } = getPrisma(c.env.DATABASE_URL);
  const res = await user.update({
    where: { email },
    data: {
      firstName,
      lastName,
    },
    select: {
      firstName: true,
      lastName: true,
    },
  });
  return res;
}

export async function getUsers(email: string, c: Context) {
  const { user } = getPrisma(c.env.DATABASE_URL);
  const res = await user.findFirst({
    where: {
      email,
    },
  });
  return res;
}

export async function getUsersWithTodos(email: string, c: Context) {
  const { user } = getPrisma(c.env.DATABASE_URL);
  const res = await user.findFirst({
    where: {
      email,
    },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      id: true,
      todos: true,
    },
  });
  return res;
}
