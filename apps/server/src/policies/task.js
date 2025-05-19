import { Permissions } from "@/enums/permission";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";

export const canViewTask = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.VIEW_ONLY,
    },
  });

  return !!member;
});


export const canCreateTask = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.CREATE_TASK,
    },
  });

  return !!member;
});

export const canEditTask = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.EDIT_TASK,
    },
  });

  return !!member;
})

export const canDeleteTask = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.DELETE_TASK,
    },
  });

  return !!member;
})