import z from "zod";
import { userSchema } from "./user.validation.js";

const registerSchema = userSchema.extend({
  confirmPassword: z.string().trim().max(255),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: "Password must match!",
  path: ["confirmPassword"],
});

const loginSchema = userSchema.pick({ email: true, password: true });

export { loginSchema, registerSchema };
