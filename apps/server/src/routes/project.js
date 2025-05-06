import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { mongoObjectIdSchema } from "@/schemas/mongo";

import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "@/controllers/project";

const router = new Hono();

router.get("/", getProjects);
router.get(
  "/:projectId",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  getProject
);
router.post("/", createProject);
router.patch(
  "/:projectId",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  updateProject
);
router.delete(
  "/:projectId",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  deleteProject
);

export default router;
