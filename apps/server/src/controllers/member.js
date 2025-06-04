import { asyncHandler } from "@/utils/async-handler";
import { NotFoundException } from "@/utils/app-error";
import { Member } from "@/models/member";
import { User } from "@/models/user";
import { Workspace } from "@/models/workspace";
import { STATUS } from "@/utils/constants";
import { canAddMember, canViewMember } from "@/policies/member";
import { authz } from "@/utils/auth";

export async function getMembers(c) {
  const {
    include,
    filters: { workspace, ...filters },
    sort,
    fields,
    size,
    page,
  } = c?.query;

  const memberships = await Member.find({ user: c.user.id, workspace });

  const workspaces = memberships.map((membership) => membership.workspace);

  const query = {
    $and: [
      {
        workspace: {
          $in: workspaces,
        },
      },
      { ...filters },
    ],
  };

  const options = {
    populate: include,
    sort,
    limit: size,
    skip: (page - 1) * size,
  };

  const projection = {
    ...fields,
    permissions: false,
  };

  const members = await Member.find(query, projection, options);
  const totalRecords = await Member.countDocuments(query);

  return c.json.success({
    data: {
      members,
      totalRecords,
      totalPages: page && Math.ceil(totalRecords / size),
      page,
      size,
    },
  });
}

export async function getMember(c) {
  const memberId = c.req.param("memberId");

  const member = await Member.findById(memberId);

  if (!member) throw new NotFoundException("Member not found");

  await authz(canViewMember, member, c.user);

  return c.json.success({ data: { member } });
}

export const createMember = asyncHandler(async function (c) {
  const { user: userId, workspace: workspaceId, role } = await c.req.json();

  const user = await User.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new NotFoundException("Workspace not found");

  await canAddMember(c.user, workspace);

  const member = new Member({
    user: userId,
    workspace: workspaceId,
    role,
  });

  await member.save();

  return c.json.success({ statusCode: STATUS.HTTP.CREATED, data: workspace });
});

export function updateMember(c) {}

export function deleteMember(c) {}
