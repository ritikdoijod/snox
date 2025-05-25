import { Plus, Search } from "lucide-react";
import { auth } from "@/lib/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TaskCard } from "@/components/cards/task";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const loader = auth(async function ({ params: { projectId }, fc }) {
  const { project } = await fc.get(`/projects/${projectId}`);
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
  return (
    <div className="flex flex-1">
      <div className="px-8 space-y-3 flex-1">
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
          <CardTitle>Test</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
