import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { mongoObjectIdSchema } from "@/schemas/mongo";

import {
  createMember,
  deleteMember,
  getMember,
  getMembers,
  updateMember,
  addPermissions,
  removePermissions,
} from "@/controllers/member";

const router = new Hono();

router.get("/", getMembers);
router.get(
  "/:memberId",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  getMember
);
router.post("/", createMember);
router.patch(
  "/:memberId",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  updateMember
);
router.delete(
  "/:memberId",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  deleteMember
);

// member permissions
router.post(
  "/:memberId/permissions",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  addPermissions
);
router.delete(
  "/:memberId/permissions",
  zValidator(
    "param",
    z.object({
      workspaceId: mongoObjectIdSchema("Invalid workspace id"),
    })
  ),
  removePermissions
);

export default router;
