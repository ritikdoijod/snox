import { workspacesAction } from "./actions";
import { workspacesLoader } from "./loaders";

import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export const loader = workspacesLoader;
export const action = workspacesAction;

export default function Workspaces({ loaderData: { workspaces } }) {
  return (
    <main className="h-screen">
      <div className="h-full md:flex md:flex-col md:justify-center mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <img src="/logo.svg" className="w-[80px]" />

          <ModeToggle />
        </nav>
        <div className="md:flex-1 flex flex-col justify-center items-center">
          <div className="flex flex-col">
            {workspaces?.map((workspace) => (
              <Button asChild variant="link" key={workspace.id}>
                <Link to={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
