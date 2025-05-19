import QueryString from "qs";
import { Outlet } from "react-router";

import { auth } from "@/lib/auth";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
