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
  lastName?: string;
  phoneNumber?: string;
};

export async function createUser(
  { email, password, firstName, lastName, phoneNumber }: CreateUser,
  c: Context
) {
  try {
    const { user } = getPrisma(c.env.DATABASE_URL);
    const createdUser = await user.create({
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
        firstName: true,
        lastName: true,
        phoneNumber: true,
      },
    });

    return createdUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function UpdateUserPassword(
  {
    email,
    password,
    newPassword,
  }: Pick<CreateUser, "email" | "password"> & { newPassword: string },
  c: Context
) {
  try {
    const updatedUser = await getPrisma(c.env.DATABASE_URL).user.update({
      where: {
        email,
        password,
      },
      data: {
        password: newPassword,
      },
      select: {
        email: true,
        id: true,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserDetails(
  { email }: { email: string },
  {
    firstName,
    lastName,
    phoneNumber,
  }: { firstName: string; lastName: string; phoneNumber: string },
  c: Context
) {
  try {
    const { user } = getPrisma(c.env.DATABASE_URL);
    const updatedUser = await user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        phoneNumber,
      },
      select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUser({ email }: { email: string }, c: Context) {
  try {
    const { user } = getPrisma(c.env.DATABASE_URL);
    const userDetails = await user.findFirst({
      where: {
        email,
      },
      select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        id: true,
        todos: true,
      },
    });
    return userDetails;
  } catch (error) {
    throw error;
  }
}

export async function getUserTodos({ email }: { email: string }, c: Context) {
  try {
    const { user } = getPrisma(c.env.DATABASE_URL);
    const todos = await user.findFirst({
      where: {
        email,
      },
      select: {
        todos: true,
      },
    });
    return todos;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
