import { Outlet, useLocation } from "react-router";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Separator } from "@/components/ui/separator";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { ClipboardList, Pentagon, Settings2, UsersRound } from "lucide-react";

export async function loader() {
  return {
    workspace: {
      _id: "ws1",
      name: "Workspace 1",
      description: "This is test workspace",
      author: "testuser1"
    },
    workspaces: [
      {
        _id: "ws1",
        name: "Workspace 1",
        description: "This is test workspace",
        author: "testuser1"
      },
      {
        _id: "ws2",
        name: "Workspace 2",
        description: "This is test workspace",
        author: "testuser1"
      }
    ]
  };
}

export default function DashboardLayout({
  loaderData: { workspace, workspaces },
}) {
  const location = useLocation();
  const navMain = [
    {
      title: "Home",
      icon: Pentagon,
      url: "",
    },
    {
      title: "My Tasks",
      icon: ClipboardList,
      url: "/tasks",
    },
    {
      title: "Settings",
      icon: Settings2,
      url: "/settings",
    },
    {
      title: "Members",
      icon: UsersRound,
      url: "/members",
    }
  ];

  return (
    <div>
      <SidebarProvider>
        <AppSidebar
          activeWorkspace={workspace}
          workspaces={workspaces}
          navMain={navMain}
        />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-6"
              />
              <h2 className="font-medium">
                {navMain.find((nav) => location.pathname === nav.url)?.title ||
                  workspace.name}
              </h2>
            </div>
          </header>
          <Separator />
          <Outlet context={{ workspace }} />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

