import { useState, useEffect } from "react";
import { Link, redirect, useNavigate } from "react-router";
import QueryString from "qs";
import { Folders, Info, Plus, Search } from "lucide-react";

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

export const loader = auth(async function ({
  params: { projectId },
  fc,
  request,
}) {
  const search = new URL(request.url).searchParams.get("search");

  const { tasks } = await fc.get(
    `/tasks?${QueryString.stringify({
      search,
      filters: [
        {
          $match: {
            project: projectId,
          },
        },
      ],
      include: ["createdBy"],
    })}`,
  );

  return {
    tasks,
  };
});

export const action = auth(async function ({
  request,
  params: { workspaceId, projectId },
  fc,
}) {
  let actionData = {};

  switch (request.method) {
    case "POST": {
      const { title, description, priority, assignee, dueDate } =
        await request.json();

      const { task } = await fc.post("/tasks", {
        title,
        description,
        project: projectId,
        priority,
        status: "TODO",
        assignee,
        dueDate,
      });

      actionData = redirect(
        `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`,
      );
      break;
    }

    case "PATCH": {
      const {
        taskId,
        title,
        description,
        status,
        priority,
        dueDate,
        assignee,
      } = await request.json();
      await fc.patch(`/tasks/${taskId}`, {
        title,
        description,
        status,
        priority,
        dueDate,
        assignee,
      });
      break;
    }

    case "DELETE": {
      const { taskId } = await request.json();
      await fc.delete(`/tasks/${taskId}`);
      actionData = redirect(
        `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
      );
      break;
    }

    default: {
      actionData = { error: { message: "Method not allowed" } };
      break;
    }
  }

  return actionData;
});

export default function Tasks({
  params: { workspaceId, projectId },
  loaderData: { tasks },
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState();

  useEffect(() => {
    if (!search || search === "")
      navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks`);
    else {
      navigate(
        `/workspaces/${workspaceId}/projects/${projectId}/tasks?search=${search}`,
      );
    }
  }, [search]);

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-3 flex-1">
        <Card className="min-h-96">
          <CardHeader className="gap-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3">
                <Folders className="size-5" />
                Tasks
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    className="peer pe-9 bg-background w-48 h-9"
                    placeholder="Search task..."
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                  <Button
                    variant="ghost"
                    className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer h-9"
                  >
                    <Search size={16} aria-hidden="true" />
                  </Button>
                </div>
                <Button className="size-8" asChild>
                  <Link
                    to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/new`}
                  >
                    <Plus />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 mt-2 gap-4">
                {tasks.map((task) => (
                  <Link
                    key={task.id}
                    to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task.id}`}
                  >
                    <Card className="py-4 gap-3">
                      <CardHeader className="px-4">
                        <CardTitle className="text-xs font-medium flex gap-2 items-center">
                          {task.title}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {task.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4">
                        <div className="flex gap-2 items-center">
                          <Avatar className="size-5">
                            <AvatarImage src={task.createdBy.avatar} />
                            <AvatarFallback className="text-[0.55rem]">
                              {task.createdBy.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs">{task.createdBy.name}</p>
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>
              <Info className="size-5" />
            </span>
            Info
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-6 text-sm">
          {/* All tasks */}
          <div className="flex items-start gap-2">
            <div className="text-xs space-y-1">
              <div className="text-muted-foreground">All Tasks</div>
              <div>{tasks.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
