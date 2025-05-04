import { Hono } from "hono";
import { getUser,getUsers } from "@/controllers/user.js";

const router = new Hono();

router.get('/', getUsers)
router.get('/:userId', getUser)

export default router;
