import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";

export const workspacesAction = auth(async function ({
  request,
  params,
  session,
}) {
  let actionData = {};
  api.session(session);

  switch (request.method) {
    case "POST": {
      const { name, description } = await request.json();
      const workspace = await api.post("/workspaces", {
        name,
        description,
      });
      actionData = { workspace };
      break;
    }

    case "PATCH": {
      const workspaceId = params.workspaceId;
      const { name, description } = await request.json();
      const workspace = await api.patch(`/workspaces/${workspaceId}`, {
        name,
        description,
      });
      actionData = { workspace };
      break;
    }

    case "DELETE": {
      const workspaceId = params.workspaceId;
      await api.delete(`/workspaces/${workspaceId}`);
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
