import QueryString from "qs";
import { Outlet } from "react-router";

import { auth } from "@/lib/auth";

import { AppSidebar } from "@/components/layout/app-sidebar";

export const loader = auth(async function ({ params: { workspaceId }, fc }) {
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

  return { workspace, workspaces, projects };
});

export default function WorkspaceLayout({
  loaderData: { workspace, workspaces, projects },
}) {
  return (
    <div className="flex h-full mx-auto">
      <AppSidebar />
      <Outlet context={{ workspace, workspaces, projects }} />
    </div>
  );
}
