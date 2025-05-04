import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";
import QueryString from "qs";

export async function getWorkspaces(session) {
  const { workspaces } = await api.get("/workspaces", { session });

  return workspaces;
}

export async function getWorkspace(workspaceId, session) {
  const { workspace } = await api.get(`/workspaces/${workspaceId}`, {
    session,
  });

  return workspace;
}

export const getMember = auth(async function ({
  params: { memberId },
  session,
}) {
  const { member } = await api.get(`/members/${memberId}`, {
    session,
  });

  return { member };
});

export async function getProjects(workspaceId, session) {
  const { projects } = await api.get(
    `/projects?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
    })}`,
    {
      session,
    }
  );

  return projects;
}
