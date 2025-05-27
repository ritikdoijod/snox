import { format } from "date-fns";
import { Link } from "react-router";
import { CalendarDays, Clock, Info, Pencil, Plus, Search, Trash } from "lucide-react";
import { auth } from "@/lib/auth";
import { useAuth } from "@/lib/contexts/auth";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TaskCard } from "@/components/cards/task";
import QueryString from "qs";

export const loader = auth(async function ({ params: { projectId }, fc }) {
  const { project } = await fc.get(
    `/projects/${projectId}?${QueryString.stringify({
      include: ["createdBy"],
    })}`
  );
  const { tasks } = await fc.get(`/tasks`);

  return {
    project,
    tasks: tasks.map((task) => ({
      ...task,
      assignee: {
        id: "user1",
        name: "User 1",
        profilePic: "https://github.com/shadcn.png",
        email: "user@mail.com",
      },
    })),
  };
});
const tasksTabs = [
  {
    label: (
      <Button
        variant="outline"
        className="px-3.5 rounded-full data-[state=active]:border border-border"
      >
        <span
          className="size-1.5 rounded-full bg-cyan-500"
          aria-hidden="true"
        ></span>
        All
      </Button>
    ),
    value: "all",
  },
  {
    label: (
      <Button
        variant="outline"
        className="px-3.5 rounded-full data-[state=active]:border border-border"
      >
        <span
          className="size-1.5 rounded-full bg-amber-500"
          aria-hidden="true"
        ></span>
        Pending
      </Button>
    ),
    value: "pending",
  },
  {
    label: (
      <Button
        variant="outline"
        className="px-3.5 rounded-full data-[state=active]:border border-border"
      >
        <span
          className="size-1.5 rounded-full bg-red-500"
          aria-hidden="true"
        ></span>
        Overdue
      </Button>
    ),
    value: "overdue",
  },
];

export default function ({
  loaderData: { project, tasks },
  params: { workspaceId, projectId },
}) {
  const { user } = useAuth();

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <Breadcrumb className="py-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  to={`/workspaces/${workspaceId}/projects/${projectId}`}
                >
                  {project.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-primary">Tasks</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {!!tasks.length && (
            <div className="flex gap-4 items-center">
              <div className="mt-1 relative">
                <Input
                  className="peer pe-9 bg-background w-40 h-9"
                  placeholder="Search task..."
                />
                <Button
                  variant="ghost"
                  className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer h-9"
                >
                  <Search size={16} aria-hidden="true" />
                </Button>
              </div>

              <Button className="cursor-pointer size-8" asChild>
                <Link
                  to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/new`}
                >
                  <Plus />
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div>
          {tasks.length > 0 ? (
            <Tabs defaultValue={tasksTabs[0].value}>
              <TabsList className="flex gap-6 bg-transparent">
                {tasksTabs.map((tab, index) => (
                  <TabsTrigger key={index} value={tab.value} asChild>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tasksTabs.map((tab, index) => (
                <TabsContent
                  key={index}
                  value={tab.value}
                  className="mt-8 grid lg:grid-cols-2 lg:gap-8"
                >
                  {tasks.map((task) => (
                    <Link
                      to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`}
                      key={task.id}
                    >
                      <TaskCard task={task} />
                    </Link>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card className="grid gap-8 place-content-center">
              <CardContent className="flex flex-col items-center gap-8">
                <p className="text-center">Start by creating your first task</p>
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
              <p className="text-center">Let others add you in a task</p>
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
                to={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
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
                  to={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
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
