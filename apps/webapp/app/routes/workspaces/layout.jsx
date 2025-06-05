import QueryString from "qs";
import { Outlet } from "react-router";

import { auth } from "@/lib/auth";

import { AppSidebar } from "@/components/layout/app-sidebar";

export const loader = auth(async function ({
  params: { workspaceId },
  fc,
  session,
}) {
  const { workspace } = await fc.get(
    `/workspaces/${workspaceId}?${QueryString.stringify({
      include: ["createdBy"],
    })}`
  );
  const { workspaces } = await fc.get("/workspaces");
  const { projects } = await fc.get(
    `/projects?${QueryString.stringify({
      filters: [
        {
          $match: {
            workspace: workspaceId,
          },
        },
      ],
      include: ["createdBy"],
    })}`
  );

  const { members } = await fc.get(
    `/members?${QueryString.stringify({
      filters: [
        {
          $match: {
            workspace: workspaceId,
          },
        },
      ],
      include: ["user"],
    })}`
  );

  const userRole = members.find(
    (member) => member.user.id === session.get("uid")
  ).id;

  return { workspace, workspaces, projects, members, userRole };
});

export default function WorkspaceLayout({
  loaderData: { workspace, workspaces, projects, members, userRole },
}) {
  return (
    <div className="flex h-full mx-auto">
      <AppSidebar />
      <Outlet
        context={{ workspace, workspaces, projects, members, userRole }}
      />
    </div>
  );
}
