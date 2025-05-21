import { Link, useLoaderData } from "react-router";
import { ChevronsUpDown, Plus, Check, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { CreateWorkspaceDialog } from "@/components/features/create-workspace";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const WorkspaceSwitcher = () => {
  const { workspaces, workspace: activeWorkspace } = useLoaderData();

  return (
    <div className="space-y-2">
      <div className="px-2 text-xs font-medium text-muted-foreground flex items-center justify-between">
        Workspaces
        <CreateWorkspaceDialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-5"
            >
              <Plus className="size-3" />
            </Button>
          </DialogTrigger>
        </CreateWorkspaceDialog>
      </div>
      <div className="px-2">
        <CreateWorkspaceDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-3 p-6 w-full">
                <div className="bg-sidebar text-sidebar-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
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
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Plus className="size-4" />
                  </div>
                  Add workspace
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </CreateWorkspaceDialog>
      </div>
    </div>
  );
};

export { WorkspaceSwitcher };
