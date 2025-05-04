import mongoose from "mongoose";
import { asyncHandler } from "@/utils/async-handler";
import { NotFoundException, ForbiddenException } from "@/utils/app-error";
import { Member } from "@/models/member";
import { User } from "@/models/user";
import { Workspace } from "@/models/workspace";
import { AppEvent } from "@/models/event";
import { STATUS } from "@/utils/constants";
import { Permissions } from "@/enums/permission";
import { Actions } from "@/enums/action";
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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const {
      user: userId,
      workspace: workspaceId,
      permissions,
    } = await c.req.json();

    const user = await User.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    await authz(canAddMember, workspace, c.user);

    const member = new Member({
      user: userId,
      workspace: workspaceId,
      permissions,
    });

    const event = new AppEvent({
      subject: member.id,
      subjectType: "Member",
      action: "create",
      createdBy: c.user.id,
      data: await c.req.json(),
    });

    await member.save({ session });
    await event.save({ session });
    await session.commitTransaction();

    return c.json.success({ statusCode: STATUS.HTTP.CREATED, data: workspace });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

export function updateMember(c) {}

export function deleteMember(c) {}

export const addPermissions = asyncHandler(async function (c) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { permissions } = await c.req.json();

    const memberId = c.req.param("memberId");

    const member = await Member.findById(memberId);

    if (!member) throw new NotFoundException("Member not found");

    const requestingMember = await Member.findOne({
      user: c.user.id,
      workspace: member.workspace,
      permissions: {
        $eq: Permissions.EDIT_MEMBER_PERMISSIONS,
      },
    });

    if (!requestingMember) throw new ForbiddenException("Access denied");

    member.push(permissions);

    const event = new AppEvent({
      subject: member.id,
      subjectType: "Member",
      action: Actions.ADD_PERMISSION,
      createdBy: c.user.id,
      data: await c.req.json(),
    });

    await member.save({ session });
    await event.save({ session });
    await session.commitTransaction();

    return c.json.success({ statusCode: STATUS.HTTP.CREATED, data: workspace });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

export const removePermissions = asyncHandler(async function (c) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { permissions } = await c.req.json();

    const memberId = c.req.param("memberId");

    const member = await Member.findById(memberId);

    if (!member) throw new NotFoundException("Member not found");

    const requestingMember = await Member.findOne({
      user: c.user.id,
      workspace: member.workspace,
      permissions: {
        $eq: Permissions.EDIT_MEMBER_PERMISSIONS,
      },
    });

    if (!requestingMember) throw new ForbiddenException("Access denied");

    member.pull(permissions);

    const event = new AppEvent({
      subject: member.id,
      subjectType: "Member",
      action: Actions.REMOVE_PERMISSION,
      createdBy: c.user.id,
      data: await c.req.json(),
    });

    await member.save({ session });
    await event.save({ session });
    await session.commitTransaction();

    return c.json.success({ statusCode: STATUS.HTTP.CREATED, data: workspace });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});
