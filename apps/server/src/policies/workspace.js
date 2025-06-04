import { Permissions } from "@/enums/role";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";
import { RolePermissions } from "@/utils/role-permission";

export const canViewWorkspace = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
  });

  return (
    !!member && RolePermissions[member.role].includes(Permissions.VIEW_ONLY)
  );
});

export const canEditWorkspace = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
  });

  return (
    !!member &&
    RolePermissions[member.role].includes(Permissions.EDIT_WORKSPACE)
  );
});

export const canDeleteWorkspace = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
  });

  return (
    !!member &&
    RolePermissions[member.role].includes(Permissions.DELETE_WORKSPACE)
  );
});
