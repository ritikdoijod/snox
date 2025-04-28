import { Hono } from "hono";
import { login, registerUser } from "./auth.handler"

const router = new Hono();

router.post('/login', login)
router.post('/register', registerUser)

export default router;
