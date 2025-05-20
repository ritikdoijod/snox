import { Hono } from "hono";
import { z } from "zod";
import { validate } from "@/middlewares/validate";
import { mongoObjectIdSchema } from "@/schemas/mongo";
import {
  createComment,
  deleteComment,
  getComment,
  getComments,
  updateComment,
} from "@/controllers/comment";
import { commentSchema } from "@/schemas/comment";

const router = new Hono();

router.get("/", getComments);
router.get(
  "/:taskId",
  validate({
    param: z.object({
      commentId: mongoObjectIdSchema("Invalid comment id"),
    }),
  }),
  getComment
);
router.post("/", validate({ body: commentSchema }), createComment);
router.patch(
  "/:taskId",
  validate({
    param: z.object({
      commentId: mongoObjectIdSchema("Invalid comment id"),
    }),
    body: commentSchema.partial(),
  }),
  updateComment
);
router.delete(
  "/:taskId",
  validate({
    param: z.object({
      commentId: mongoObjectIdSchema("Invalid comment id"),
    }),
  }),
  deleteComment
);

export default router;
