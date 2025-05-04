import { Permissions } from "@/enums/permission";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";

export const canCreateProject = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user.id,
    workspace: workspace.id,
    permissions: {
      $eq: Permissions.CREATE_PROJECT,
    },
  });

  return !!member;
});
