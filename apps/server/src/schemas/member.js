import { z } from "zod";
import { mongoObjectIdSchema } from "./mongo";
import { Roles } from "@/enums/role";

export const taskSchema = z.object({
  user: mongoObjectIdSchema("Invalid user id"),
  workspace: mongoObjectIdSchema("Invalid workspace id"),
  role: z.enum(Object.values(Roles)).optional(),
});
