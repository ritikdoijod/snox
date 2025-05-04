import { Hono } from "hono";
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "@/controllers/workspace.js";

const router = new Hono();

router.get("/", getWorkspaces);
router.get("/:workspaceId", getWorkspace);
router.post("/", createWorkspace);
router.patch("/:workspaceId", updateWorkspace);
router.delete("/:workspaceId", deleteWorkspace);

export default router;
