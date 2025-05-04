import { Hono } from "hono";
import {
  createMember,
  deleteMember,
  getMember,
  getMembers,
  updateMember,
  addPermissions,
  removePermissions
} from "@/controllers/member";

const router = new Hono();

router.get("/", getMembers);
router.get("/:memberId", getMember);
router.post("/", createMember);
router.patch("/:memberId", updateMember);
router.delete("/:memberId", deleteMember);

// member permissions
router.post("/:memberId/permissions", addPermissions);
router.delete("/:memberId/permissions", removePermissions);


export default router;
