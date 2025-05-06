import { Permissions } from "@/enums/permission";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";

export const canViewMember = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user,
    workspace,
    permissions: {
      $eq: Permissions.VIEW_ONLY,
    },
  });

  return !!member;
});

export const canAddMember = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user,
    workspace,
    permissions: {
      $eq: Permissions.ADD_MEMBER,
    },
  });

  return !!member;
});

export const canRemoveMember = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user,
    workspace,
    permissions: {
      $eq: Permissions.REMOVE_MEMBER,
    },
  });

  return !!member;
});
