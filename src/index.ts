import { Context, Hono } from "hono";
import {
  createUser,
  getUser,
  updateUserDetails,
  updateUserPassword,
} from "./db/userQueries";
import { logger } from "hono/logger";

const app = new Hono();
app.use("*", logger());

app.post("/getUser", async (c: Context) => {
  try {
    const { email } = await c.req.json();
    const user = await getUser({ email }, c);
    if (!user) return c.notFound();
    return c.json({ user, status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ error, status: 500 });
  }
});

app.post("/createUser", async (c: Context) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } =
      await c.req.json();
    const createdUser = await createUser(
      { email, password, firstName, lastName, phoneNumber },
      c
    );
    return c.json({ createdUser, status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ error, status: 500 });
  }
});

app.post("/updatePassword", async (c: Context) => {
  try {
    const { email, password, newPassword } = await c.req.json();
    const updatedUser = await updateUserPassword(
      {
        email,
        password,
        newPassword,
      },
      c
    );
    if (!updatedUser) {
      return c.json({ message: "Couldn't update password.", status: 400 });
    }
    return c.json({ updatedUser, status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ error, status: 500 });
  }
});

app.post("/updateUser", async (c: Context) => {
  try {
    const { email, firstName, lastName, phoneNumber } = await c.req.json();
    const updatedUser = await updateUserDetails(
      { email },
      { firstName, lastName, phoneNumber },
      c
    );
    if (!updatedUser) {
      return c.json({ message: "Couldn't update user details.", status: 400 });
    }
    return c.json({ updatedUser });
  } catch (error) {
    console.error(error);
    return c.json({ error, status: 500 });
  }
});

export default app;
