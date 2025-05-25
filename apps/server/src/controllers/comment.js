import mongoose from "mongoose";
import { Task } from "@/models/task";
import { canEditTask, canViewTask } from "@/policies/task";
import { ForbiddenException, NotFoundException } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";
import { STATUS } from "@/utils/constants";
import { Comment } from "@/models/comment";
import { Permissions } from "@/enums/permission";

export const getComments = asyncHandler(async function (c) {
  const { include = [], filters, sort, fields, size, page } = c?.query;

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
    task: [
      {
        $lookup: {
          from: "tasks",
          localField: "task",
          foreignField: "_id",
          as: "task",
        },
      },
      {
        $unwind: {
          path: "$task",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  };

  // aggregation pipeline
  const pipeline = [
    // Stage 1: Lookup the task to get the project
    {
      $lookup: {
        from: "tasks",
        localField: "task",
        foreignField: "_id",
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
        localField: "task.project",
        foreignField: "_id",
        as: "project",
      },
    },
    // Stage 4: Unwind project
    { $unwind: "$project" },

    // Stage 5: Lookup memberships to verify user is a member of the workspace
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
              permissions: {
                $elemMatch: { $eq: Permissions.VIEW_ONLY },
              },
            },
          },
        ],
        as: "memberships",
      },
    },
    // Stage 6: Filter comments
    {
      $match: {
        memberships: { $ne: [] },
      },
    },

     // Stage 7: add relationships
     ...include?.flatMap(
      (item) =>
        Array.isArray(relationships[item])
          ? relationships[item] // If it's an array, spread it
          : [relationships[item]] // If it's a single stage, wrap in array
    ),


    // // stage 8: clean up
    {
      $project: {
        memberships: 0,
        project: 0,
        task: 0,
      },
    },
  ];

  const comments = await Comment.aggregate(pipeline);
  const totalRecords = await Comment.countDocuments([
    ...pipeline,
    { $count: "count" },
  ]).then((result) => result[0]?.count || 0);

  return c.json.success({
    data: {
      comments,
      totalRecords,
      totalPages: page && Math.ceil(totalRecords / size),
      page,
      size,
    },
  });
});

export const getComment = asyncHandler(async function (c) {
  const { commentId } = c.req.param();
  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundException("Comment not found");

  await canViewTask(c.user.id, comment.task);

  return c.json.success({ data: { comment } });
});

export const createComment = asyncHandler(async function (c) {
  const { content, task: taskId } = await c.req.json();

  const task = await Task.findById(taskId);
  if (!task) throw new NotFoundException("Task not found");

  await canEditTask(c.user.id, task.id);

  const comment = new Comment({
    content,
    task: task.id,
    createdBy: c.user.id,
  });

  await comment.save();

  return c.json.success({
    statusCode: STATUS.HTTP.CREATED,
    data: { comment },
  });
});

export const updateComment = asyncHandler(async function (c) {
  const { commentId } = c.req.param();
  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundException("Comment not found");

  // can edit comment
  if (c.user.id !== comment.createdBy) ForbiddenException("Access denied");

  const { content } = await c.req.json();
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
    },
    {
      returnDocument: "after",
    }
  );

  return c.json.success({ data: { comment: updatedComment } });
});

export const deleteComment = asyncHandler(async function (c) {
  const { commentId } = c.req.param();
  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundException("Comment not found");

  // can delete comment
  if (c.user.id !== comment.createdBy) ForbiddenException("Access denied");

  await Comment.findByIdAndDelete(commentId);

  return c.json.success({ data: {} });
});
