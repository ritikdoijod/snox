import mongoose from "mongoose";

import { Permissions } from "@/enums/permission";
import { AppEvent } from "@/models/event";
import { Member } from "@/models/member";
import { Workspace } from "@/models/workspace";
import {
  canDeleteWorkspace,
  canEditWorkspace,
  canViewWorkspace,
} from "@/policies/workspace";

import { NotFoundException } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";
import { STATUS } from "@/utils/constants";

export const getWorkspaces = asyncHandler(async function (c) {
  const pipeline = [
    // State 1
    {
      $lookup: {
        from: "members",
        let: { workspaceId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$workspace", "$$workspaceId"] },
                  { $eq: ["$user", new mongoose.Types.ObjectId(c.user.id)] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
        ],
        as: "members",
      },
    },
    {
      $match: {
        members: { $ne: [] },
      },
    },
  ];

  const workspaces = await Workspace.aggregate(pipeline);

  return c.json.success({ data: { workspaces } });
});

export const getWorkspace = asyncHandler(async function (c) {
  const workspaceId = c.req.param("workspaceId");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new NotFoundException("Workspace not found");

  await canViewWorkspace(c.user.id, workspaceId);

  return c.json.success({ data: { workspace } });
});

export const createWorkspace = asyncHandler(async function (c) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { name, description } = await c.req.json();

    const workspace = new Workspace({
      name,
      description,
      author: c.user.id,
    });

    const member = new Member({
      user: c.user.id,
      workspace: workspace.id,
      permissions: Object.values(Permissions),
    });

    const event = new AppEvent({
      subject: workspace.id,
      subjectType: "Workspace",
      action: "create",
      createdBy: c.user.id,
      data: await c.req.json(),
    });

    await workspace.save({ session });
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

export const updateWorkspace = asyncHandler(async function (c) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { workspaceId } = c.req.param();

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    await canEditWorkspace(c.user.id, workspaceId);

    const { name, description } = await c.req.json();

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      {
        name,
        description,
      },
      {
        returnDocument: "after",
      }
    ).session(session);

    const event = new AppEvent({
      subject: workspace.id,
      subjectType: "Workspace",
      action: "update",
      createdBy: c.user.id,
      data: await c.req.json(),
    });

    await event.save({ session });
    await session.commitTransaction();

    return c.json.success({ data: { workspace: updatedWorkspace } });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

export const deleteWorkspace = asyncHandler(async function (c) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { workspaceId } = c.req.param();

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    await canDeleteWorkspace(c.user.id, workspaceId);

    await Workspace.findByIdAndDelete(workspaceId).session(session);

    await Member.deleteMany({
      workspace: workspaceId,
    });

    const event = new AppEvent({
      subject: workspaceId,
      subjectType: "Workspace",
      action: "delete",
      createdBy: c.user.id,
      data: workspace,
    });

    await event.save({ session });
    await session.commitTransaction();

    return c.json.success({ data: {} });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});
