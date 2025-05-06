import { Outlet } from "react-router";
import { AppSidebar } from "@/components/shared/app-sidebar";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { auth } from "@/lib/auth";
import { getProjects, getWorkspace, getWorkspaces } from "./loaders";

export const loader = auth(async function ({
  params: { workspaceId },
  session,
}) {
  // const workspace = await getWorkspace(workspaceId, session);
  const workspaces = await getWorkspaces(session);
  // const projects = await getProjects(workspaceId, session);

  // return { workspace, workspaces, projects };
  return { workspaces };
});

export default function WorkspaceLayout({
  loaderData: { workspace, workspaces },
}) {
  return (
    <SidebarProvider>
      <AppSidebar activeWorkspace={workspace} workspaces={workspaces} />
      <SidebarInset>
        {/* <header className="sticky border-b top-0 z-10 bg-background flex h-14 shrink-0 items-center group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-6"
            />
            <h2 className="font-medium"></h2>
          </div>
        </header> */}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
