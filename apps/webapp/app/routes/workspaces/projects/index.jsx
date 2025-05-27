import { Link, redirect } from "react-router";
import QueryString from "qs";
import { auth } from "@/lib/auth";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const loader = auth(async function ({ params: { workspaceId }, fc }) {
  const { projects } = await fc.get(
    `/projects?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
    })}`
  );

  return { projects };
});

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
      const projectId = params.projectId;
      const { name, description } = await request.json();
      const { project } = await fc.patch(`/projects/${projectId}`, {
        name,
        description,
      });
      actionData = { project };
      break;
    }

    case "DELETE": {
      const projectId = params.projectId;
      await fc.delete(`/projects/${projectId}`);
      actionData = { success: true };
      break;
    }

    default: {
      actionData = { error: { message: "Method not allowed" } };
      break;
    }
  }

  return actionData;
});

export default function WorkspaceProjects({
  params: { workspaceId },
  loaderData: { projects },
}) {
  return (
    <div className="flex flex-1">
      <div className="px-8 space-y-3 flex-1">
        <Breadcrumb className="py-3">
          <BreadcrumbList>
            <BreadcrumbItem className="text-primary font-medium">
              Projects
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 mt-2 gap-4">
            {projects?.map((project) => (
              <Link
                to={`/workspaces/${workspaceId}/projects/${project.id}`}
                key={project.id}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Avatar>
                      <AvatarImage src="" alt="" />
                      <AvatarFallback className="text-xs">TU</AvatarFallback>
                    </Avatar>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
