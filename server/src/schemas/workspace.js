import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  avatar: z.string().nullable().optional(),
});

export const getWorkspaceQuerySchema = z.object({
  include: z.array(z.enum(["createdBy"])).optional(),
});
