import { Link, useOutletContext } from "react-router";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  Info,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/auth";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ({ params: { workspaceId, projectId } }) {
  const { user } = useAuth();
  const { project, tasks } = useOutletContext();

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-6 flex-1">
        <Card>
          <CardHeader className="gap-3">
            <CardTitle className="flex items-center gap-3">
              <Avatar className="rounded-md">
                <AvatarImage src={project.avatar} />
                <AvatarFallback className="rounded-md">
                  {project?.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {project.name}
            </CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex gap-6">
            <Link to={`/workspaces/${workspaceId}/projects`}>
              <div className="px-4 py-3 border rounded-xl min-w-40">
                <h3 className="text-xs font-medium flex items-center justify-between gap-2">
                  All Tasks{" "}
                  <span className="text-cyan-500">
                    {/* <Folders className="size-5" /> */}
                  </span>
                </h3>
                <p className="mt-1 text-2xl font-semibold">{tasks.length}</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="ms-1 text-sm font-medium">Recent Tasks</h2>
          {tasks.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {tasks.map((task) => (
                <Link
                  to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`}
                  key={task.id}
                >
                  <TaskCard task={task} />
                </Link>
              ))}
            </div>
          ) : (
            <Card className="grid gap-8 place-content-center">
              <CardContent className="flex flex-col items-center gap-8">
                <p className="text-center text-xs">Start by creating your first task</p>
                <Button className="cursor-pointer" asChild>
                  <Link
                    to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/new`}
                  >
                    <Plus />
                    Create task
                  </Link>
                </Button>
              </CardContent>
              <div className="flex gap-4 items-center w-lg">
                <Separator className="flex-1" />
                <span className="text-sm text-nowrap"> Or </span>
                <Separator className="flex-1" />
              </div>
              <p className="text-center text-xs">Let others add you in a task</p>
            </Card>
          )}
        </div>
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
        <CardContent className="space-y-6 text-sm">
          {/* Owner Info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage alt={project.createdBy.name} />
              <AvatarFallback>{project.createdBy.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs font-medium">
                {project.createdBy.id === user.id
                  ? "You"
                  : project.createdBy.name}
              </div>
              <div className="text-[0.65rem] text-muted-foreground">Owner</div>
            </div>
          </div>

          <Separator />

          {/* Created */}
          <div className="flex items-start gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />
            <div className="text-xs space-y-1">
              <div className="text-muted-foreground">Created</div>
              <div>{format(project.createdAt, "d MMM yyyy, h:mm a")}</div>
            </div>
          </div>

          {/* Updated */}
          <div className="flex items-start gap-2">
            <Clock className="size-4 text-muted-foreground mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="text-muted-foreground">Last Updated</div>
              <div>{format(project.updatedAt, "d MMM yyyy, h:mm a")}</div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-2"
              asChild
            >
              <Link
                to={`/workspaces/${workspaceId}/projects/${projectId}/settings#edit`}
              >
                <Pencil className="size-3" />
                Edit
              </Link>
            </Button>

            {project.createdBy.id === user.id && (
              <Button
                size="sm"
                className="bg-destructive/50 hover:bg-destructive/80 cursor-pointer text-xs"
                asChild
              >
                <Link
                  to={`/workspaces/${workspaceId}/projects/${projectId}/settings#delete`}
                >
                  <Trash className="size-3" />
                  Delete
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TaskCard({ task: { title, description, status, assignee } }) {
  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <CardTitle className="text-xs">{title}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {description}
        </CardDescription>{" "}
      </CardHeader>
      <CardContent className="flex gap-2 items-center">
        <Avatar className="size-7 ring ring-card text-xs">
          <AvatarImage src={assignee.profilePic} alt={assignee.name} />
          <AvatarFallback>{assignee.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
}
