import mongoose from "mongoose";

import { Roles } from "@/enums/role";
import { Member } from "@/models/member";
import { Workspace } from "@/models/workspace";
import { Project } from "@/models/project";
import { Task } from "@/models/task";
import { Comment } from "@/models/comment";

import { BadRequestException, NotFoundException } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";
import { STATUS } from "@/utils/constants";
import { uploadFile } from "@/utils/file-upload";

import {
  canDeleteWorkspace,
  canEditWorkspace,
  canViewWorkspace,
} from "@/policies/workspace";

export const getWorkspaces = asyncHandler(async function (c) {
  const {
    search,
    include = [],
    filters = [],
    sort,
    fields,
    size,
    page,
  } = c?.query;

  const relationships = {
    members: {
      $lookup: {
        from: "members",
        let: { workspaceId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$workspace", "$$workspaceId"],
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
  };

  const pipeline = [
    // Stage 1: Search
    ...(search
      ? [
          {
            $match: {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),

    // Stage 2: filters
    ...filters,

    // Stage 3:
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
                  { $eq: ["$user", c.user._id] },
                ],
              },
            },
          },
        ],
        as: "memberships",
      },
    },

    // Stage 4
    {
      $match: {
        memberships: { $ne: [] },
      },
    },

    // Stage 5
    ...include?.map((item) => relationships[item]),

    // Stage 6: clean up
    {
      $project: {
        memberships: 0,
      },
    },
  ];

  const workspaces = await Workspace.aggregate(pipeline);

  return c.json.success({
    data: { workspaces },
  });
});

export const getWorkspace = asyncHandler(async function (c) {
  const workspaceId = c.req.param("workspaceId");
  const { include = [] } = c?.query;

  const workspace = await Workspace.findById(workspaceId).populate(include);
  if (!workspace) throw new NotFoundException("Workspace not found");

  await canViewWorkspace(c.user, workspace);

  return c.json.success({ data: { workspace } });
});

export const createWorkspace = asyncHandler(async function (c) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { name, description, avatar } = await c.req.json();

    // check if workspace exist with same name for user
    const existingWorkspace = await Workspace.findOne({
      name,
      createdBy: c.user.id,
    });

    if (existingWorkspace) {
      throw new BadRequestException(
        "Workspace with the same name already exists."
      );
    }

    const newWorkspace = new Workspace({
      name,
      description,
      ...(!!avatar ? { avatar: await uploadFile(avatar) } : null),
      createdBy: c.user.id,
    });

    const member = new Member({
      user: c.user.id,
      workspace: newWorkspace.id,
      role: Roles.OWNER,
    });

    await newWorkspace.save({ session });
    await member.save({ session });
    await session.commitTransaction();
    await session.endSession();
    return c.json.success({
      statusCode: STATUS.HTTP.CREATED,
      data: { workspace: newWorkspace },
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
});

export const updateWorkspace = asyncHandler(async function (c) {
  const { workspaceId } = c.req.param();

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new NotFoundException("Workspace not found");

  await canEditWorkspace(c.user, workspace);

  const { name, description, avatar } = await c.req.json();

  const updatedWorkspace = await Workspace.findByIdAndUpdate(
    workspaceId,
    {
      name,
      description,
      ...(avatar ? { avatar: await uploadFile(avatar) } : { avatar }),
    },
    {
      returnDocument: "after",
    }
  );

  return c.json.success({ data: { workspace: updatedWorkspace } });
});

export const deleteWorkspace = asyncHandler(async function (c) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { workspaceId } = c.req.param();

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    await canDeleteWorkspace(c.user, workspace);

    await Workspace.findByIdAndDelete(workspaceId).session(session);

    await Member.deleteMany({
      workspace: workspace.id,
    }).session(session);

    const projects = await Project.deleteMany({
      workspace: workspace.id,
    }).session(session);

    if (!!projects.length) {
      // TODO: test this section
      const tasks = await Task.deleteMany({
        project: {
          $in: projects?.map((project) => project.id),
        },
      }).session(session);

      if (!!tasks.length) {
        await Comment.deleteMany({
          task: { $in: tasks?.map((task) => task.id) },
        }).session(session);
      }
    }

    await session.commitTransaction();
    await session.endSession();
    await session.endSession();

    return c.json.success({ data: {} });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  } finally {
  }
});
