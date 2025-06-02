import mongoose from "mongoose";
import { Project } from "@/models/project";
import { Task } from "@/models/task";
import {
  canCreateTask,
  canViewTask,
  canEditTask,
  canDeleteTask,
} from "@/policies/task";
import { NotFoundException } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";
import { STATUS } from "@/utils/constants";
import { Comment } from "@/models/comment";

export const getTasks = asyncHandler(async function (c) {
  const { include = [], filters = [], sort, fields, size, page } = c?.query;

  const relationships = {
    createdBy: [
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  };

  // aggregation pipeline
  const pipeline = [
    // stage 6: filters
    ...filters,

    // Stage 1: Lookup the project to get the workspace
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    // Stage 2: Unwind project to access workspace
    {
      $unwind: "$project",
    },
    // Stage 3: Lookup memberships to verify user is a member of the workspace
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
                  { $eq: ["$user", new mongoose.Types.ObjectId(c.user.id)] },
                ],
              },
            },
          },
        ],
        as: "memberships",
      },
    },
    // Stage 4: Filter tasks where user is a member
    {
      $match: {
        memberships: { $ne: [] },
      },
    },
    // stage 5: add relationships
    ...include?.flatMap(
      (item) =>
        Array.isArray(relationships[item])
          ? relationships[item] // If it's an array, spread it
          : [relationships[item]] // If it's a single stage, wrap in array
    ),

    // stage 7: clean up
    {
      $project: {
        memberships: 0,
        project: 0,
      },
    },
  ];

  const tasks = await Task.aggregate(pipeline);
  const totalRecords = await Task.countDocuments([
    ...pipeline,
    { $count: "count" },
  ]).then((result) => result[0]?.count || 0);

  return c.json.success({
    data: {
      tasks,
      totalRecords,
      totalPages: page && Math.ceil(totalRecords / size),
      page,
      size,
    },
  });
});

export const getTask = asyncHandler(async function (c) {
  const { taskId } = c.req.param();
  const { include = [] } = c?.query;
  const task = await Task.findById(taskId)
    .populate("project")
    .populate(include);
  if (!task) throw new NotFoundException("Task not found");

  await canViewTask(c.user.id, task.project.workspace);

  task.project = task.project.id;

  return c.json.success({ data: { task } });
});

export const createTask = asyncHandler(async function (c) {
  const {
    title,
    description,
    project: projectId,
    status,
    priority,
    dueDate,
    assignee,
  } = await c.req.json();

  const project = await Project.findById(projectId);
  if (!project) throw new NotFoundException("Project not found");

  await canCreateTask(c.user.id, project.workspace);

  const task = new Task({
    title,
    description,
    project: projectId,
    status,
    priority,
    createdBy: c.user.id,
    dueDate,
    assignee,
  });

  await task.save();

  return c.json.success({
    statusCode: STATUS.HTTP.CREATED,
    data: { task },
  });
});

export const updateTask = asyncHandler(async function (c) {
  const { taskId } = c.req.param();
  const task = await Task.findById(taskId);
  if (!task) throw new NotFoundException("Task not found");

  const { title, description, project, status, priority, dueDate, assignee } =
    await c.req.json();

  await canEditTask(c.user.id, task.id);

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      project,
      status,
      priority,
      dueDate,
      assignee,
    },
    {
      returnDocument: "after",
    }
  );

  return c.json.success({ data: { task: updatedTask } });
});

export const deleteTask = asyncHandler(async function (c) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { taskId } = c.req.param();
    const task = await Task.findById(taskId).populate("project");
    if (!task) throw new NotFoundException("Task not found");

    await canDeleteTask(c.user.id, task.project.workspace);

    await Task.findByIdAndDelete(taskId).session(session);
    await Comment.deleteMany({ task: taskId }).session(session);

    await session.commitTransaction();

    return c.json.success({ data: {} });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});
