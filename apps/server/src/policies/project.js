import { Permissions } from "@/enums/permission";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";

export const canCreateProject = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.CREATE_PROJECT,
    },
  });

  return !!member;
});

export const canEditProject = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.EDIT_PROJECT,
    },
  });

  return !!member;
});

export const canDeleteProject = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.DELETE_PROJECT,
    },
  });

  return !!member;
});
