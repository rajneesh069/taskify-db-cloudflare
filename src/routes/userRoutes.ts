import { Context, Hono } from "hono";
import { getPrisma } from "@/db/prismaFunction";
import { z } from "zod";
const app = new Hono();

const userSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string()
    .min(1, "Username is required")
    .max(255, "Username is too long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(255, "First name is too long"),
  lastName: z.string().max(255).optional(),
  email: z
    .string()
    .email("Invalid email address")
    .max(300, "Email is too long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const userSignInSchema = z
  .object({
    username: z.string().min(1, "Username cannot be empty").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.username || data.email, {
    message: "Either username or email must be provided",
  });

type UserData = z.infer<typeof userSchema>;
type UserSignInData = z.infer<typeof userSignInSchema>;

// create user for sign-up purposes
app.post("/create", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const result = userSchema.safeParse(await c.req.parseBody());

  if (!result.success) {
    return c.json(
      { message: "Invalid User Data", error: result.error.errors },
      { status: 403 }
    );
  }

  const userData: UserData = result.data;

  try {
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    return c.json({ user }, { status: 200 });
  } catch (error) {
    return c.json({ message: "Error registering the user." }, { status: 500 });
  }
});

// get user by id and password for sign-in purposes
app.post("/find", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const result = userSignInSchema.safeParse(await c.req.parseBody());
  if (!result.success) {
    return c.json(
      { message: "Invalid Sign In data", error: result.error.errors },
      { status: 401 }
    );
  }
  const userData = result.data;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: userData.username }, { email: userData.email }],
        password: userData.password,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
      include: {
        todos: true,
      },
    });
    if (!user) {
      return c.json({ message: "User credentials invalid" }, { status: 401 });
    }
    return c.json({ message: "User Found", user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Database Error" }, { status: 500 });
  }
});

//! get user info by id => may not be required, we'll see
app.get("/:id", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const id = c.req.param("id");
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
      include: {
        todos: true,
      },
    });
    if (!user) {
      return c.json({ message: "User doesn't exist" }, { status: 404 });
    }
    return c.json({ message: "User Found", user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Couldn't fetch user" }, { status: 500 });
  }
});

export default app;
