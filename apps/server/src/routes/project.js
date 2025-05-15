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
import { getProjectsQuerySchema, projectSchema } from "@/schemas/project";
import { validate } from "@/middlewares/validate";

const router = new Hono();

router.get("/", validate({ query: getProjectsQuerySchema }), getProjects);
router.get(
  "/:projectId",
  validate({
    param: z.object({
      projectId: mongoObjectIdSchema("Invalid project id"),
    }),
  }),
  getProject
);
router.post("/", validate({ body: projectSchema }), createProject);
router.patch(
  "/:projectId",
  validate({
    param: z.object({
      projectId: mongoObjectIdSchema("Invalid project id"),
    }),
  }),
  updateProject
);
router.delete(
  "/:projectId",
  validate({
    param: z.object({
      projectId: mongoObjectIdSchema("Invalid project id"),
    }),
  }),
  deleteProject
);

export default router;
