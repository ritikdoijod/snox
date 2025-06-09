import { Hono } from "hono";
import { z } from "zod";

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaces,
  updateWorkspace,
} from "@/controllers/workspace";

import { validate } from "@/middlewares/validate";
import { mongoObjectIdSchema } from "@/schemas/mongo";
import { getWorkspaceQuerySchema, workspaceSchema } from "@/schemas/workspace";

const router = new Hono();

router.get("/", getWorkspaces);
router.get(
  "/:workspaceId",
  validate({
    param: z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    }),
    query: getWorkspaceQuerySchema,
  }),
  getWorkspace,
);
router.post(
  "/",
  validate({
    body: workspaceSchema,
  }),
  createWorkspace,
);
router.patch(
  "/:workspaceId",
  validate({
    param: z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    }),
    body: workspaceSchema.partial(),
  }),
  updateWorkspace,
);
router.delete(
  "/:workspaceId",
  validate({
    param: z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    }),
  }),
  deleteWorkspace,
);

export default router;
