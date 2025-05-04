import mongoose from "mongoose";
import { Workspace } from "@/models/workspace";
import { Member } from "@/models/member";
import { AppEvent } from "@/models/event";
import { NotFoundException, ForbiddenException } from "@/utils/app-error";
import { STATUS } from "@/utils/constants";
import { asyncHandler } from "@/utils/async-handler";
import { Permissions } from "@/enums/permission";
import { canEditWorkspace } from "@/policies/workspace";

export async function getWorkspaces(c) {
  try {
    const memberships = await Member.find({
      user: c.user.id,
    }).populate("workspace");

    const workspaces = memberships.map((membership) => membership.workspace);

    return c.json.success({ data: { workspaces } });
  } catch (error) {
    throw error;
  }
}

export async function getWorkspace(c) {
  try {
    const workspaceId = c.req.param("workspaceId");

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) throw new NotFoundException("Workspace not found");

    const member = await Member.findOne({
      user: c.user.id,
      workspace: workspaceId,
      permissions: {
        $eq: Permissions.VIEW_ONLY,
      },
    });

    if (!member) throw new ForbiddenException("Access denied");

    return c.json.success({ data: { workspace } });
  } catch (error) {
    throw error;
  }
}

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

export const updateWorkspace = asyncHandler(async function (c, next) {
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

    const member = await Member.findOne({
      user: c.user.id,
      workspace: workspaceId,
      permissions: {
        $elemMatch: {
          action: "delete",
          resourceType: "Workspace",
          resourceId: workspaceId,
        },
      },
    });

    if (!member) throw new ForbiddenException("Access denied");

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
