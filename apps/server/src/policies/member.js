import { Permissions } from "@/enums/role";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";
import { RolePermissions } from "@/utils/role-permission";

export const canViewMember = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
  });

  return RolePermissions[member.role].includes(Permissions.VIEW_ONLY);
});

export const canAddMember = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
  });

  return RolePermissions[member.role].includes(Permissions.ADD_MEMBER);
});

export const canRemoveMember = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
  });

  return RolePermissions[member.role].includes(Permissions.REMOVE_MEMBER);
});
