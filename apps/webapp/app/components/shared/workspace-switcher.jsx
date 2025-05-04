import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Plus, Check, ArrowRight } from "lucide-react";
import { useAppSidebar } from "./app-sidebar.jsx";

const WorkspaceSwitcher = () => {
  const { activeWorkspace, workspaces } = useAppSidebar();
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="p-0 space-y-1">
      <SidebarGroupLabel className="flex justify-between group-data-[collapsible=icon]:hidden">
        Workspaces
        <Button variant="outline" size="icon" className="rounded-full size-5">
          <Link to="/workspaces/new">
            <Plus className="size-3" />
          </Link>
        </Button>
      </SidebarGroupLabel>
      <SidebarMenu className="px-2 group-data-[collapsible=icon]:p-0">
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {activeWorkspace?.name[0].toUpperCase()}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeWorkspace?.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeWorkspace?.plan}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Workspaces
              </DropdownMenuLabel>
              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className="cursor-pointer gap-2 p-2"
                  asChild
                >
                  <Link to={`/workspaces/${workspace.id}`}>
                    <div className="flex aspect-square size-6 items-center justify-center rounded-sm border text-xs">
                      {workspace.name[0].toUpperCase()}
                    </div>
                    {workspace.name}
                    {workspace.id === activeWorkspace.id && (
                      <DropdownMenuShortcut>
                        <Check className="h-4 w-4" />
                      </DropdownMenuShortcut>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
              <Button variant="link" className="cursor-pointer text-xs" asChild>
                <Link to="/workspaces">
                  Show all
                  <ArrowRight />
                </Link>
              </Button>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="w-full">
                <Link to="/workspaces/new">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Plus className="size-4" />
                  </div>
                  Add workspace
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export { WorkspaceSwitcher };
