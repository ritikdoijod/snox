import mongoose from "mongoose";
import { asyncHandler } from "@/utils/async-handler";
import { STATUS } from "@/utils/constants";
import { uploadFile } from "@/utils/file-upload";
import { BadRequestException, NotFoundException } from "@/utils/app-error";

import { Project } from "@/models/project";
import { Workspace } from "@/models/workspace";
import { Task } from "@/models/task";
import { Comment } from "@/models/comment";

import {
  canCreateProject,
  canDeleteProject,
  canEditProject,
  canViewProject,
} from "@/policies/project";

export const getProjects = asyncHandler(async function (c) {
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
    tasks: {
      $lookup: {
        from: "tasks",
        let: { projectId: "$_id" },
        pipeline: [{ $match: { $expr: { $eq: ["$project", "$$projectId"] } } }],
        as: "tasks",
      },
    },
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
    workspace: [
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace",
          foreignField: "_id",
          as: "workspace",
        },
      },
      {
        $unwind: {
          path: "$workspace",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  };

  // aggregation pipeline
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

    // Stage 3: match wokrspaces where user is a member
    {
      $lookup: {
        from: "members",
        let: { workspaceId: "$workspace" },
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

    // Stage 4: filter projects where user is a member of any workspace
    {
      $match: {
        memberships: { $ne: [] },
      },
    },

    // Stage 5: add relationships
    ...include?.flatMap(
      (item) =>
        Array.isArray(relationships[item])
          ? relationships[item] // If it's an array, spread it
          : [relationships[item]], // If it's a single stage, wrap in array
    ),

    // Stage 6: clean up memberships in result
    {
      $project: {
        memberships: 0,
      },
    },
  ];

  const projects = await Project.aggregate(pipeline);
  const totalRecords = await Project.countDocuments([
    ...pipeline,
    { $count: "count" },
  ]).then((result) => result[0]?.count || 0);

  return c.json.success({
    data: {
      projects,
      totalRecords,
      totalPages: page && Math.ceil(totalRecords / size),
      page,
      size,
    },
  });
});

export const getProject = asyncHandler(async function (c) {
  const projectId = c.req.param("projectId");
  const { include = [] } = c?.query;
  const project = await Project.findById(projectId).populate(include);
  if (!project) throw new NotFoundException("Project not found");

  await canViewProject(c.user, project);

  return c.json.success({
    data: { project },
  });
});

export const createProject = asyncHandler(async function (c) {
  const {
    name,
    description,
    workspace: workspaceId,
    avatar,
  } = await c.req.json();

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new NotFoundException("Workspace not found");

  await canCreateProject(c.user, workspace);

  // check if project exist with same name in the workspace
  const existingProject = await Project.findOne({
    name,
    workspace: workspaceId,
  });

  if (existingProject) {
    throw new BadRequestException("Project with the same name already exists.");
  }

  const newProject = new Project({
    name,
    description,
    workspace: workspaceId,
    ...(!!avatar ? { avatar: await uploadFile(avatar) } : null),
    createdBy: c.user.id,
  });

  await newProject.save();

  return c.json.success({
    statusCode: STATUS.HTTP.CREATED,
    data: { project: newProject },
  });
});

export const updateProject = asyncHandler(async function (c) {
  const projectId = c.req.param("projectId");
  const project = await Project.findById(projectId);
  if (!project) throw new NotFoundException("Project not found");

  const { name, description, avatar } = await c.req.json();

  await canEditProject(c.user, project);

  const updatedProject = await Project.findByIdAndUpdate(
    project.id,
    {
      name,
      description,
      ...(avatar ? { avatar: await uploadFile(avatar) } : { avatar }),
    },
    {
      returnDocument: "after",
    },
  );

  return c.json.success({
    data: { project: updatedProject },
  });
});

export const deleteProject = asyncHandler(async function (c) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const projectId = c.req.param("projectId");
    const project = await Project.findById(projectId);
    if (!project) throw new NotFoundException("Project not found");

    await canDeleteProject(c.user, project);

    await Project.findByIdAndDelete(project.id).session(session);
    const tasks = await Task.deleteMany({ project: project.id }).session(
      session,
    );

    if (!!tasks.length) {
      await Comment.deleteMany({
        task: { $in: tasks?.map((task) => task.id) },
      }).session(session);
    }

    await session.commitTransaction();

    return c.json.success({ data: {} });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});
