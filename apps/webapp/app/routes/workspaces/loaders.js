import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";
import QueryString from "qs";

export const workspacesLoader = auth(async function ({ session }) {
  api.session(session);
  const { workspaces } = await api.get(
    `/workspaces?${QueryString.stringify({ include: ["members"] })}`
  );

  return { workspaces };
});

export const getMember = auth(async function ({
  params: { memberId },
  session,
}) {
  const { member } = await api.get(`/members/${memberId}`, {
    session,
  });

  return { member };
});

export const projectLoader = auth(async function ({
  session,
  params: { projectId },
}) {
  api.session(session);
  const { project } = await api.get(`/projects/${projectId}`);

  return { project };
});
