import { Permissions } from "@/enums/permission";
import { Member } from "@/models/member";
import { Task } from "@/models/task";
import { authz } from "@/utils/auth";
import mongoose from "mongoose";

export const canViewTask = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.VIEW_ONLY,
    },
  });

  return !!member;
});

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

export const canEditTask = authz(async function (user, task) {
  const pipeline = [
    // Stage 1: Match the specific task
    {
      $match: {
        _id: new mongoose.Types.ObjectId(task),
      },
    },
    // Stage 2: Lookup the project to get the workspace
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },

    // Stage 3: Unwind task to access project
    {
      $unwind: "$project",
    },
    // Stage 4: Lookup memberships to verify user is a member of the workspace
    {
      $lookup: {
        from: "members",
        let: { workspaceId: "$project.workspace" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$workspace", "$$workspaceId"] },
                  { $eq: ["$user", new mongoose.Types.ObjectId(user)] },
                ],
              },
              permissions: {
                $elemMatch: { $eq: Permissions.EDIT_TASK },
              },
            },
          },
        ],
        as: "memberships",
      },
    },
    // Stage 7: Filter tasks where user is a member
    {
      $match: {
        memberships: { $ne: [] },
      },
    },

    // stage 8: clean up
    {
      $project: {
        _id: 1,
      },
    },
  ];

  const result = await Task.aggregate(pipeline);

  return result.length > 0;
});

export const canDeleteTask = authz(async function (user, workspace) {
  const member = await Member.findOne({
    user: user,
    workspace: workspace,
    permissions: {
      $eq: Permissions.DELETE_TASK,
    },
  });

  return !!member;
});
