import { useState } from "react";
import { Link, useNavigate } from "react-router";

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
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
// import { CreateWorkspaceForm } from "@/components/forms/create-workspace";
import { useAppSidebar } from "./app-sidebar.jsx";

const WorkspaceSwitcher = () => {
  const { activeWorkspace, workspaces } = useAppSidebar();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [createdWorkspace, setCreatedWorkspace] = useState();

  return (
    <SidebarGroup className="p-0 space-y-1">
      <SidebarGroupLabel className="flex justify-between">
        Workspaces
        <Button variant="outline" size="icon" className="rounded-full size-5">
          <Link to={`/workspaces/new`}>
            <Plus className="size-3" />
          </Link>
        </Button>
      </SidebarGroupLabel>
      <SidebarMenu className="px-2">
        <SidebarMenuItem>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
                >
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {activeWorkspace.name[0].toUpperCase()}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeWorkspace.name}
                    </span>
                    <span className="truncate text-xs">
                      {activeWorkspace.plan}
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
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace._id}
                    className="cursor-pointer gap-2 p-2"
                    asChild
                  >
                    <Link to={`/workspaces/${workspace._id}`}>
                      <div className="flex aspect-square size-6 items-center justify-center rounded-sm border text-xs">
                        {workspace.name[0].toUpperCase()}
                      </div>
                      {workspace.name}
                      {workspace._id === activeWorkspace._id && (
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
                  <DialogTrigger>
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <Plus className="size-4" />
                    </div>
                    Add workspace
                  </DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              {!!createdWorkspace ? (
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="grid size-16 place-content-center rounded-full bg-black/80 text-white">
                    <Check className="size-8" />
                  </div>
                  <DialogHeader>
                    <DialogTitle>Workspace created successfully.</DialogTitle>
                  </DialogHeader>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        navigate(`/workspaces/${createdWorkspace._id}`);
                        setCreatedWorkspace(null);
                      }}
                    >
                      Go to {createdWorkspace.name}
                    </Button>
                  </DialogClose>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Let&apos;s build a workspace</DialogTitle>
                    <DialogDescription>
                      Set up your new workspace to organize your projects and
                      tasks.
                    </DialogDescription>
                  </DialogHeader>
                  {/* <CreateWorkspaceForm */}
                  {/*   onSuccess={(workspace) => { */}
                  {/*     setCreatedWorkspace(workspace); */}
                  {/*   }} */}
                  {/* /> */}
                </>
              )}
            </DialogContent>
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export { WorkspaceSwitcher };
