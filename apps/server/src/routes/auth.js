import { Hono } from "hono";
import { login, registerUser } from "@/controllers/auth.js"

const router = new Hono();

router.post('/login', login)
router.post('/register', registerUser)

export default router;
