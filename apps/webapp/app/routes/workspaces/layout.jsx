import QueryString from "qs";
import { Outlet } from "react-router";

import { auth } from "@/lib/auth";

import { AppSidebar } from "@/components/layout/app-sidebar";


export const loader = auth(async function ({ params: { workspaceId }, fc }) {
  const { workspace } = await fc.get(`/workspaces/${workspaceId}`);
  const { workspaces } = await fc.get("/workspaces");
  const { projects } = await fc.get(
    `/projects?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
    })}`
  );

  return { workspace, workspaces, projects };
});

export default function WorkspaceLayout({
  loaderData: { workspace, workspaces },
}) {
  return (
    <div className="w-7xl p-8 flex h-full mx-auto">
      <AppSidebar />
      <Outlet />
    </div>
  );
}
