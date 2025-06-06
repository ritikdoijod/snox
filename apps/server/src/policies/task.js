import { Permissions } from "@/enums/role";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";
import { RolePermissions } from "@/utils/role-permission";
import mongoose from "mongoose";

export const canViewTask = authz(async function (user, task) {
  const pipeline = [
    // Stage 1: Lookup the task to get the project
    {
      $lookup: {
        from: "tasks",
        let: { taskId: new mongoose.Types.ObjectId(task.id) },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$taskId"],
              },
            },
          },
        ],
        as: "task",
      },
    },

    // Stage 2: Unwind task to access project
    {
      $unwind: "$task",
    },

    // Stage 3: Lookup the project to get the workspace
    {
      $lookup: {
        from: "projects",
        let: { projectId: "$task.project" },
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

    // Stage 4: Unwind project to access workspace
    {
      $unwind: "$project",
    },

    // Stage 5: Lookup memberships to verify user is a member of the workspace
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$workspace", "$project.workspace"] },
            { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] },
          ],
        },
      },
    },

    // Stage 6:
    {
      $limit: 1,
    },
  ];

  const [member] = await Member.aggregate(pipeline);

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

    // Stage 3: Lookup memberships to verify user is a member of the workspace
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$workspace", "$project.workspace"] },
            { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] },
          ],
        },
      },
    },

    // Stage 4:
    {
      $limit: 1,
    },
  ];

  const [member] = await Member.aggregate(pipeline);

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

    // Stage 3: Lookup memberships to verify user is a member of the workspace
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$workspace", "$project.workspace"] },
            { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] },
          ],
        },
      },
    },

    // Stage 4:
    {
      $limit: 1,
    },
  ];

  const [member] = await Member.aggregate(pipeline);

  return (
    !!member && RolePermissions[member.role].includes(Permissions.DELETE_TASK)
  );
});
