import { Plus, Search } from "lucide-react";
import { auth } from "@/lib/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TaskCard } from "@/components/cards/task";
import { Link } from "react-router";

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
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

export default function ({
  loaderData: { project, tasks },
  params: { workspaceId, projectId },
}) {
  return (
    <div className="flex h-full">
      <div className="flex-1 p-8">
        <div className="flex flex-col items-start justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>{project.name}</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Tasks</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-8 w-full">
            {tasks.length > 0 ? (
              <Tabs defaultValue={tasksTabs[0].value}>
                <div className="flex items-center justify-between">
                  <TabsList className="flex gap-6 bg-transparent">
                    {tasksTabs.map((tab, index) => (
                      <TabsTrigger key={index} value={tab.value} asChild>
                        <Button
                          className="rounded-full px-5"
                          variant="outline"
                          size="sm"
                        >
                          {tab.label}
                        </Button>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="flex gap-4 items-center">
                    <div className="mt-1 relative">
                      <Input
                        className="peer pe-9"
                        placeholder="Search task..."
                      />
                      <Button
                        variant="ghost"
                        className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
                      >
                        <Search size={16} aria-hidden="true" />
                      </Button>
                    </div>

                    <Button className="cursor-pointer" asChild>
                      <Link
                        to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/new`}
                      >
                        <Plus />
                        Add new task
                      </Link>
                    </Button>
                  </div>
                </div>
                {tasksTabs.map((tab, index) => (
                  <TabsContent
                    key={index}
                    value={tab.value}
                    className="mt-8 grid lg:grid-cols-3 lg:gap-8"
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
              <div className="grid gap-8 p-8 place-content-center border border-dashed rounded-lg">
                <div className="flex flex-col items-center gap-8">
                  <p className="text-center">
                    Start by creating your first task
                  </p>
                  <Button>
                    <Plus />
                    Create task
                  </Button>
                </div>
                <div className="flex gap-4 items-center w-lg">
                  <Separator className="flex-1" />
                  <span className="text-sm text-nowrap"> Or </span>
                  <Separator className="flex-1" />
                </div>
                <p className="text-center">Let others add you in a task</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-md bg-accent/10 hidden lg:block">
        <div className="p-8">
          <h2 className="text-lg font-medium">Summary</h2>
        </div>
        <div></div>
      </div>
    </div>
  );
}
