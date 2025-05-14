import { Permissions } from "@/enums/permission";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";

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
