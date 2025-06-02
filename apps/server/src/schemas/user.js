import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().max(1000).optional(),
  bio: z.string().max(1000).optional(),
  avatar: z.string().nullable().optional(),
  password: z.string(),
});
