import { Hono } from "hono";
import { z } from "zod";
import { mongoObjectIdSchema } from "@/schemas/mongo";

import { getUser, getUsers, updateUser } from "@/controllers/user";
import { validate } from "@/middlewares/validate";
import { userSchema } from "@/schemas/user";

const router = new Hono();

router.get("/", getUsers);
router.get(
  "/:userId",
  validate({
    param: z.object({
      userId: mongoObjectIdSchema("Invalid user id"),
    }),
  }),
  getUser
);
router.patch("/", validate({ body: userSchema.partial() }), updateUser);

export default router;
