import { redirect } from "react-router";
import { auth } from "@/lib/auth";

export const action = auth(async function ({
  request,
  params: { workspaceId, projectId },
  fc,
}) {
  let actionData = {};

  switch (request.method) {
    case "POST": {
      const { title, description, priority, assignee } = await request.json();

      const {task} = await fc.post("/tasks", {
        title,
        description,
        project: projectId,
        priority,
        status: "TODO",
        assignee,
      });

      actionData = redirect(
        `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`
      );
      break;
    }

    case "PATCH": {
      const { name, description } = await request.json();
      const { project } = await fc.patch(`/projects/${projectId}`, {
        name,
        description,
      });
      actionData = { project };
      break;
    }

    case "DELETE": {
      await fc.delete(`/projects/${projectId}`);
      actionData = { success: true };
      break;
    }

    default: {
      actionData = { error: { message: "Method not allowed" } };
      break;
    }
  }

  return actionData;
});
