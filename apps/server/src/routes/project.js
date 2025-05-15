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
import { getProjectsQuerySchema } from "@/schemas/project";

const router = new Hono();

router.get("/", zValidator("query", getProjectsQuerySchema), getProjects);
router.get(
  "/:projectId",
  zValidator(
    "param",
    z.object({
      projectId: mongoObjectIdSchema("Invalid project id"),
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
      projectId: mongoObjectIdSchema("Invalid project id"),
    })
  ),
  updateProject
);
router.delete(
  "/:projectId",
  zValidator(
    "param",
    z.object({
      projectId: mongoObjectIdSchema("Invalid project id"),
    })
  ),
  deleteProject
);

export default router;
