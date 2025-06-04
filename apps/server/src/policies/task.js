import { Permissions } from "@/enums/role";
import { Member } from "@/models/member";
import { Task } from "@/models/task";
import { authz } from "@/utils/auth";
import { RolePermissions } from "@/utils/role-permission";
import mongoose from "mongoose";

export const canViewTask = authz(async function (user, task) {
  const pipeline = [
    // Stage 1: Lookup the project to get the workspace
    {
      $lookup: {
        from: "projects",
        let: { projectId: task.project },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$projectId"],
              },
            },
          },
        ],
        as: "project",
      },
    },

    // Stage 2: Unwind project to access workspace
    {
      $unwind: "$project",
    },

    // State 3: Lookup memberships to verify user is a member of the workspace
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
                  { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "member",
      },
    },
  ];

  const member = await Member.aggregate(pipeline);

  return (
    !!member && RolePermissions[member.role].includes(Permissions.VIEW_ONLY)
  );
});

export const canCreateTask = authz(async function (user, project) {
  const member = await Member.findOne({
    user: user.id,
    workspace: project.workspace,
  });

  return (
    !!member && RolePermissions[member.role].includes(Permissions.CREATE_TASK)
  );
});

export const canEditTask = authz(async function (user, task) {
  const pipeline = [
    // Stage 1: Lookup the project to get the workspace
    {
      $lookup: {
        from: "projects",
        let: { projectId: task.project },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$projectId"],
              },
            },
          },
        ],
        as: "project",
      },
    },

    // Stage 2: Unwind project to access workspace
    {
      $unwind: "$project",
    },

    // State 3: Lookup memberships to verify user is a member of the workspace
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
                  { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "member",
      },
    },
  ];

  const member = await Member.aggregate(pipeline);

  return (
    !!member && RolePermissions[member.role].includes(Permissions.EDIT_TASK)
  );
});

export const canDeleteTask = authz(async function (user, workspace) {
  const pipeline = [
    // Stage 1: Lookup the project to get the workspace
    {
      $lookup: {
        from: "projects",
        let: { projectId: task.project },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$projectId"],
              },
            },
          },
        ],
        as: "project",
      },
    },

    // Stage 2: Unwind project to access workspace
    {
      $unwind: "$project",
    },

    // State 3: Lookup memberships to verify user is a member of the workspace
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
                  { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "member",
      },
    },
  ];

  const member = await Member.aggregate(pipeline);

  return (
    !!member && RolePermissions[member.role].includes(Permissions.DELETE_TASK)
  );
});
