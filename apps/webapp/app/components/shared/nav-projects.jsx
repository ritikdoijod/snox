import { Link, useFetcher } from "react-router"

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Folder, MoreHorizontal, Trash } from "lucide-react";
import { useAppSidebar } from "./app-sidebar.jsx";

const NavProjects = () => {
  const { activeWorkspace } = useAppSidebar();
  const fetcher = useFetcher();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex justify-between">
        Projects
        <Button variant="outline" size="icon" className="rounded-full size-5">
          <Link to={`/workspaces/${activeWorkspace._id}/projects/new`}>
            <Plus className="size-3" />
          </Link>
        </Button>
      </SidebarGroupLabel>
      <SidebarMenu>
        {activeWorkspace?.projects?.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild>
              <Link to={`/workspaces/${project.workspace}/projects/${project._id}`}>
                {project.name}
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to={`/workspaces/${project.workspace}/projects/${project._id}`}>
                    <Folder />
                    View Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive hover:text-destructive" onClick={() => {
                  fetcher.submit(null, { action: `/workspaces/${project.workspace}/projects/${project._id}`, method: "delete" })
                }}>
                  <Trash className="text-destructive" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup >
  );
};

export { NavProjects };
