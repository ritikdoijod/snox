import { Hono } from "hono";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "@/controllers/project";

const router = new Hono();

router.get("/", getProjects);
router.get("/:project", getProject);
router.post("/", createProject);
router.patch("/:project", updateProject);
router.delete("/:project", deleteProject);

export default router;
