import { Project } from "@/models/project";
import { Task } from "@/models/task";
import { canCreateTask } from "@/policies/task";
import { NotFoundException } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";

export const getTasks = asyncHandler(async function (c) {})

export const getTask = asyncHandler(async function (c) {})

export const createTask = asyncHandler(async function (c) {
  const {
    title,
    description,
    project: projectId,
    status,
    priority,
    assignee,
  } = c.req.json();

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
    assignee,
  });

  await task.save();
});

export const updateTask = asyncHandler(async function (c) {})
export const deleteTask = asyncHandler(async function (c) {})
