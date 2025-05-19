import { Hono } from "hono";
import { z } from "zod";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "@/controllers/task";
import { validate } from "@/middlewares/validate";
import { taskSchema } from "@/schemas/task";
import { mongoObjectIdSchema } from "@/schemas/mongo";

const router = new Hono();

router.get("/", getTasks);
router.get(
  "/:taskId",
  validate({
    param: z.object({
      taskId: mongoObjectIdSchema("Invalid project id"),
    }),
  }),
  getTask
);
router.post("/", validate({ body: taskSchema }), createTask);
router.patch(
  "/:taskId",
  validate({
    param: z.object({
      taskId: mongoObjectIdSchema("Invalid project id"),
    }),
    body: taskSchema.partial(),
  }),
  updateTask
);
router.delete(
  "/:taskId",
  validate({
    param: z.object({
      taskId: mongoObjectIdSchema("Invalid project id"),
    }),
  }),
  deleteTask
);

export default router;
