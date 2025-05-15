import { z } from "zod";
import { mongoObjectIdSchema } from "./mongo";

export const projectSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  workspace: mongoObjectIdSchema("Invalid workspace id"),
});

export const getProjectsQuerySchema = z.object({
  include: z.array(z.enum(["tasks", "user", "workspace"])).optional(),
});
