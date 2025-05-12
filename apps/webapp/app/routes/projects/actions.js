import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";

export const projectsAction = auth(async function ({
  request,
  params,
  session,
}) {
  let actionData = {};
  api.session(session);

  switch (request.method) {
    case "POST": {
      const { name, description, workspace } = await request.json();
      const { project } = await api.post("/projects", {
        name,
        description,
        workspace,
      });
      actionData = { project };
      break;
    }

    case "PATCH": {
      const projectId = params.projectId;
      const { name, description } = await request.json();
      const {project} = await api.patch(`/projects/${projectId}`, {
        name,
        description,
      });
      actionData = { project };
      break;
    }

    case "DELETE": {
      const projectId = params.projectId;
      await api.delete(`/projects/${projectId}`);
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
