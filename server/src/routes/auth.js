import { Hono } from "hono";
import {
  login,
  registerUser,
  googleOAuthCallback,
} from "@/controllers/auth.js";

const router = new Hono();

router.post("/login", login);
router.post("/register", registerUser);
router.get("/callback/google", googleOAuthCallback);

export default router;
