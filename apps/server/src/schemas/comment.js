import { z } from "zod";
import { mongoObjectIdSchema } from "./mongo";

export const commentSchema = z.object({
  content: z.string().max(1000).optional(),
  task: mongoObjectIdSchema("Invalid task id"),
});
