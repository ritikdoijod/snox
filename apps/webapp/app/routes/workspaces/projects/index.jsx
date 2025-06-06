import { Link, redirect } from "react-router";
import { Folders, Plus, Search } from "lucide-react";
import { auth } from "@/lib/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "../context";

export const action = auth(async function ({ request, params, fc }) {
  let actionData = {};

  switch (request.method) {
    case "POST": {
      const { name, description } = await request.json();
      const { workspaceId } = params;
      const { project } = await fc.post("/projects", {
        name,
        description,
        workspace: workspaceId,
      });
      actionData = redirect(
        `/workspaces/${workspaceId}/projects/${project.id}`
      );
      break;
    }

    case "PATCH": {
      const { name, description, avatar, projectId } = await request.json();
      const { project } = await fc.patch(`/projects/${projectId}`, {
        name,
        description,
        avatar,
      });
      actionData = { project };
      break;
    }

    case "DELETE": {
      const { projectId } = await request.json();
      await fc.delete(`/projects/${projectId}`);
      actionData = redirect(`/workspaces/${workspaceId}/projects`);
      break;
    }

    default: {
      actionData = { error: { message: "Method not allowed" } };
      break;
    }
  }

  return actionData;
});

export default function WorkspaceProjects({ params: { workspaceId } }) {
  const { projects } = useWorkspace();

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-3 flex-1">
        <Card className="min-h-96">
          <CardHeader className="gap-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3">
                <Folders className="size-5" />
                Projects
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    className="peer pe-9 bg-background w-48 h-9"
                    placeholder="Search project..."
                  />
                  <Button
                    variant="ghost"
                    className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer h-9"
                  >
                    <Search size={16} aria-hidden="true" />
                  </Button>
                </div>
                <Button className="size-9" asChild>
                  <Link to={`/workspaces/${workspaceId}/projects/new`}>
                    <Plus />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 mt-2 gap-4">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/workspaces/${workspaceId}/projects/${project.id}`}
                  >
                    <Card className="py-4 gap-3">
                      <CardHeader className="px-4">
                        <CardTitle className="text-xs font-medium flex gap-2 items-center">
                          <Avatar className="size-7 rounded-sm">
                            <AvatarImage src={project.avatar} />
                            <AvatarFallback>
                              {project.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {project.name}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4">
                        <div className="flex gap-2 items-center">
                          <Avatar className="size-5">
                            <AvatarImage src={project.createdBy.avatar} />
                            <AvatarFallback className="text-[0.55rem]">
                              {project.createdBy.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs">{project.createdBy.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <Card className="w-2xs">
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
