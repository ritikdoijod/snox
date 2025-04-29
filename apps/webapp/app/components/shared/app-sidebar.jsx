import { createContext, useContext } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";

const AppSidebarContext = createContext();

function useAppSidebar() {
  return useContext(AppSidebarContext)
};

const AppSidebar = ({ activeWorkspace, workspaces, navMain, ...props }) => {
  return (
    <AppSidebarContext.Provider value={{ activeWorkspace: activeWorkspace, workspaces, navMain }}>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="space-y-4">
          <img src="/logo.svg" className="mt-4 w-[80px] mx-auto" />

          <WorkspaceSwitcher />
        </SidebarHeader>
        <SidebarContent className="mt-4">
          <NavMain />
          <SidebarSeparator className="mx-0" />
          <NavProjects />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </AppSidebarContext.Provider>
  );
};

export { AppSidebar, useAppSidebar };
