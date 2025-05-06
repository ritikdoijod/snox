import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { mongoObjectIdSchema } from "@/schemas/mongo";

import { getUser, getUsers } from "@/controllers/user";

const router = new Hono();

router.get("/", getUsers);
router.get(
  "/:userId",
  zValidator(
    "param",
    z.object({
      userId: mongoObjectIdSchema("Invalid user id"),
    })
  ),
  getUser
);

export default router;
