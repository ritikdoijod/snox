import mongoose from "mongoose";
import { asyncHandler } from "@/utils/async-handler";
import { STATUS } from "@/utils/constants";

import { Project } from "@/models/project";
import { Workspace } from "@/models/workspace";

import { canCreateProject, canViewProject } from "@/policies/project";
import { NotFoundException } from "@/utils/app-error";

export const getProjects = asyncHandler(async function (c) {
  const { include = [], filters, sort, fields, size, page } = c?.query;

  const relationships = {
    tasks: {
      $lookup: {
        from: "tasks",
        let: { projectId: "$_id" },
        pipeline: [{ $match: { $expr: { $eq: ["$project", "$$projectId"] } } }],
        as: "tasks",
      },
    },
    user: [
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
    // stage 1: match wokrspaces where user is a member
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

    // stage 2: filter projects where user is a member of any workspace
    {
      $match: {
        memberships: { $ne: [] },
      },
    },

    // stage 3: add relationships
    ...include?.flatMap(
      (item) =>
        Array.isArray(relationships[item])
          ? relationships[item] // If it's an array, spread it
          : [relationships[item]] // If it's a single stage, wrap in array
    ),

    // // stage 4: clean up memberships in result
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

  const project = await Project.findById(projectId);

  if (!project) throw new NotFoundException("Project not found");

  await canViewProject(c.user.id, project.workspace);

  return c.json.success({
    data: { project },
  });
});

export const createProject = asyncHandler(async function (c) {
  const { name, description, workspace: workspaceId } = await c.req.json();

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new NotFoundException("Workspace not found");

  await canCreateProject(c.user.id, workspaceId);

  const project = new Project({
    name,
    description,
    workspace: workspaceId,
    createdBy: c.user.id,
  });

  await project.save();

  return c.json.success({
    statusCode: STATUS.HTTP.CREATED,
    data: { project },
  });
});

export const updateProject = asyncHandler(async function (c) {});
export const deleteProject = asyncHandler(async function (c) {});
