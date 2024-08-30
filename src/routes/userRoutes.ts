import { Context, Hono } from "hono";
import { getPrisma } from "@/db/prismaFunction";
import { User } from "@prisma/client";
import { z } from "zod";
const userRouter = new Hono();

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
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

type UserData = z.infer<typeof userSchema>;


userRouter.post("/createUser", async (c: Context) => {
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



export default userRouter;
