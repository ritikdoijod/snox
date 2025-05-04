import { Hono } from "hono";
import {
  getEvents,

} from "@/controllers/event";

const router = new Hono();

router.get("/", getEvents);

export default router;
