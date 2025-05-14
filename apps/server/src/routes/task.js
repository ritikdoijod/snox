import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { mongoObjectIdSchema } from "@/schemas/mongo";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "@/controllers/task";

const router = new Hono();

router.get("/", getTasks);
router.get(
  "/:taskId",
  zValidator(
    "param",
    z.object({
      taskId: mongoObjectIdSchema("Invalid task id"),
    })
  ),
  getTask
);
router.post("/", createTask);
router.patch(
  "/:taskId",
  zValidator(
    "param",
    z.object({
      taskId: mongoObjectIdSchema("Invalid task id"),
    })
  ),
  updateTask
);
router.delete(
  "/:taskId",
  zValidator(
    "param",
    z.object({
      taskId: mongoObjectIdSchema("Invalid project id"),
    })
  ),
  deleteTask
);

export default router;
