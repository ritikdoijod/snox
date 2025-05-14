import mongoose from "mongoose";

import { asyncHandler } from "@/utils/async-handler";
import { STATUS } from "@/utils/constants";

import { Project } from "@/models/project";
import { Workspace } from "@/models/workspace";

import { canCreateProject, canViewProject } from "@/policies/project";
import { Member } from "@/models/member";
import { NotFoundException } from "@/utils/app-error";

export const getProjects = asyncHandler(async function (c, next) {
  const {
    include,
    filters: { workspace, ...filters },
    sort,
    fields,
    size,
    page,
  } = c?.query;

  const memberships = await Member.find({ user: c.user.id, workspace });

  const workspaces = memberships.map((membership) => membership.workspace);

  const query = {
    $and: [
      {
        workspace: {
          $in: workspaces,
        },
      },
      { ...filters },
    ],
  };

  const options = {
    populate: include,
    sort,
    limit: size,
    skip: (page - 1) * size,
  };

  const projection = {
    ...fields,
    permissions: false,
  };

  const projects = await Project.find(query, projection, options);
  const totalRecords = await Member.countDocuments(query);

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

export const getProject = asyncHandler(async function (c, next) {
  const projectId = c.req.param("projectId");

  const project = await Project.findById(projectId);

  if (!project) throw new NotFoundException("Project not found");

  await canViewProject(c.user.id, project.workspace);

  return c.json.success({
    data: { project },
  });
});

export const createProject = asyncHandler(async function (c, next) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { name, description, workspace: workspaceId } = await c.req.json();

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    await canCreateProject(c.user.id, workspaceId);

    const project = new Project({
      name,
      description,
      workspace: workspaceId,
      author: c.user.id,
    });

    await project.save({ session });
    await session.commitTransaction();

    return c.json.success({
      statusCode: STATUS.HTTP.CREATED,
      data: { project },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

export const updateProject = asyncHandler(async function (c, next) {});
export const deleteProject = asyncHandler(async function (c, next) {});
