import { z } from "zod";
import { mongoObjectIdSchema } from "./mongo";
import { PRIORITY, STATUS } from "@/utils/constants";

export const taskSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  project: mongoObjectIdSchema("Invalid project id"),
  status: z.enum(Object.values(STATUS.TASK)).optional(),
  priority: z.enum(Object.values(PRIORITY)).optional(),
  dueDate: z.string().optional(),
  assignee: mongoObjectIdSchema("Invalid user id"),
});
