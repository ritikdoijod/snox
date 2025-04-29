import { Hono } from "hono";
import { getUser } from "./users.handler";

const router = new Hono();

router.get('/:userId', getUser)

export default router;
