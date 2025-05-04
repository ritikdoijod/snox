import { Permissions } from "@/enums/permission";
import { Member } from "@/models/member";

export async function canViewMember(user, member) {
  const requestingMember = await Member.findOne({
    user: user.id,
    workspace: member.workspace,
    permissions: {
      $eq: Permissions.VIEW_ONLY,
    },
  });

  return !!requestingMember;
}

export async function canAddMember(user, workspace) {
  const requestingMember = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
    permissions: {
      $eq: Permissions.ADD_MEMBER,
    },
  });

  return !!requestingMember;
}
