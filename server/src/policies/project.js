import { Permissions } from "@/enums/role";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";
import { RolePermissions } from "@/utils/role-permission";

export const canViewProject = authz(async function (user, project) {
  const member = await Member.findOne({
    user: user,
    workspace: project.workspace,
  });

  return (
    !!member && RolePermissions[member.role].includes(Permissions.VIEW_ONLY)
  );
});

export const canCreateProject = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
  });

  return (
    !!member &&
    RolePermissions[member.role].includes(Permissions.CREATE_PROJECT)
  );
});

export const canEditProject = authz(async function (user, project) {
  const member = await Member.findOne({
    user: user,
    workspace: project.workspace,
  });

  return (
    !!member && RolePermissions[member.role].includes(Permissions.EDIT_PROJECT)
  );
});

export const canDeleteProject = authz(async function (user, project) {
  const member = await Member.findOne({
    user: user,
    workspace: project.workspace,
  });

  return (
    !!member &&
    RolePermissions[member.role].includes(Permissions.DELETE_PROJECT)
  );
});
