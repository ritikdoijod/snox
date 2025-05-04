import { Permissions } from "@/enums/permission";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";

export const canEditWorkspace = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user,
    workspace,
    permissions: {
      $eq: Permissions.EDIT_WORKSPACE,
    },
  });

  return !!member;
});
