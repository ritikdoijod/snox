import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaces,
  updateWorkspace,
} from "@/controllers/workspace.js";
import { mongoObjectIdSchema } from "@/schemas/mongo";
import { workspaceSchema } from "@/schemas/workspace";

const router = new Hono();

router.get("/", getWorkspaces);
router.get("/:workspaceId", getWorkspace);
router.post("/", zValidator("json", workspaceSchema), createWorkspace);
router.patch(
  "/:workspaceId",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  zValidator("json", workspaceSchema.partial()),
  updateWorkspace
);
router.delete("/:workspaceId", deleteWorkspace);

export default router;
