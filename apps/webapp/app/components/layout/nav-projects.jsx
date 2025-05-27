import { MoreHorizontal, Plus } from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router";

import { Button } from "@/components/ui/button";

const NavProjects = () => {
  const { projects } = useLoaderData();
  const { workspaceId } = useParams();

  return (
    <div className="space-y-2">
      <div className="px-2 text-xs font-medium text-muted-foreground flex items-center justify-between">
        Projects
        <Button
          variant="outline"
          size="icon"
          className="rounded-full size-5"
          asChild
        >
          <Link to={`/workspaces/${workspaceId}/projects/new`}>
            <Plus className="size-3" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col items-start">
        {projects?.map((project) => (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs w-full justify-start px-2"
            key={project.id}
          >
            <Link
              to={`/workspaces/${project.workspace}/projects/${project.id}`}
            >
              {project.name}
            </Link>
          </Button>
        ))}
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-xs w-full justify-start px-2"
        >
          <Link to={`/workspaces/${workspaceId}/projects`}>
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export { NavProjects };
