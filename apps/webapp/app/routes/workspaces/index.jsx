import { Link } from "react-router";

import { workspacesAction } from "./actions";
import { workspacesLoader } from "./loaders";

import { ModeToggle } from "@/components/mode-toggle";
import { WorkspaceCard } from "@/components/cards/workspace";
import { CreateWorkspaceDialog } from "@/components/features/create-workspace";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import { Plus, Search } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";


export const loader = workspacesLoader;
export const action = workspacesAction;

export default function Workspaces({ loaderData: { workspaces } }) {
  return (
    <main className="h-screen">
      <div className="h-full flex flex-col mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <img src="/logo.svg" className="w-[80px]" />
          <ModeToggle />
        </nav>
        <div className="mt-12">
          {workspaces.length > 0 ? (
            <Fragment>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Workspaces</h2>
                <div className="mt-1 relative">
                  <Input className="peer pe-9" placeholder="Search member..." />
                  <Button
                    variant="ghost"
                    className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
                  >
                    <Search size={16} aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-4 gap-4">
                {workspaces.map((workspace) => (
                  <Link to={`/workspaces/${workspace.id}`} key={workspace.id}>
                    <WorkspaceCard {...workspace} />
                  </Link>
                ))}
              </div>
            </Fragment>
          ) : (
            <div className="grid gap-8 p-8 place-content-center border border-dashed rounded-lg">
              <div className="flex flex-col items-center gap-8">
                <p className="text-center">
                  Start by creating your first workspace
                </p>
                <CreateWorkspaceDialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus />
                      Create workspace
                    </Button>
                  </DialogTrigger>
                </CreateWorkspaceDialog>
              </div>
              <div className="flex gap-4 items-center w-lg">
                <Separator className="flex-1" />
                <span className="text-sm text-nowrap"> Or </span>
                <Separator className="flex-1" />
              </div>
              <p className="text-center">
                Let others include you in a workspace.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
