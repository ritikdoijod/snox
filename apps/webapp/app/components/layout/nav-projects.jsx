import { Folder, MoreHorizontal, Plus } from "lucide-react";

import { Link, useLoaderData, useParams } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavProjects = () => {
  const { projects } = useLoaderData();
  const { workspaceId, projectId } = useParams();

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
            className={cn(
              "text-xs w-full justify-start px-2 text-muted-foreground",
              {
                "bg-accent text-accent-foreground font-semibold":
                  projectId === project.id,
              }
            )}
            key={project.id}
          >
            <Link
              to={`/workspaces/${project.workspace}/projects/${project.id}`}
            >
              <Avatar className="size-5 rounded-sm">
                <AvatarImage
                  src={project.avatar}
                />
                <AvatarFallback className="rounded-sm bg-transparent">
                  <Folder />
                </AvatarFallback>
              </Avatar>
              {project.name}
            </Link>
          </Button>
        ))}
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-xs w-full justify-start px-2 text-muted-foreground"
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
