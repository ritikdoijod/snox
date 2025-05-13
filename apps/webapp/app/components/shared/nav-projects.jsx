import { Link, useFetcher, useLoaderData, useParams } from "react-router";
import { Folder, MoreHorizontal, Trash, Plus, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CreateProjectDialog } from "@/components/features/create-project";
import { DialogTrigger } from "@/components/ui/dialog";

const NavProjects = () => {
  const { workspaceId } = useParams();
  const { projects } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex justify-between">
        Projects
        <CreateProjectDialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-5"
            >
              <Plus className="size-3" />
            </Button>
          </DialogTrigger>
        </CreateProjectDialog>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects?.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild>
              <Link
                to={`/workspaces/${project.workspace}/projects/${project.id}`}
              >
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
                  <Link
                    to={`/workspaces/${project.workspace}/projects/${project.id}`}
                  >
                    <Folder />
                    View Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    fetcher.submit(null, {
                      action: `/workspaces/${project.workspace}/projects/${project.id}`,
                      method: "delete",
                    });
                  }}
                >
                  <Trash className="text-destructive" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="text-sidebar-foreground/70 text-xs">
            <Link to="#">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export { NavProjects };
