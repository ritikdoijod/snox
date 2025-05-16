import { Fragment } from "react";
import { Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { projectLoader } from "./loaders";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TaskCard } from "@/components/cards/task";

export const loader = projectLoader;

const tasksTabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

const tasks = [
  {
    id: "1",
    title: "Add tasks feature.",
    description:
      "Create tasks form. Add tasks feture on server. Connect form with backend. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat porro excepturi voluptatum id sapiente! Repudiandae nisi numquam eius dolore iusto. Nobis, eveniet. Quaerat ratione, magnam natus vitae saepe quod repudiandae?",
    priority: "HIGH",
    status: "NOT_STARTED",
    assignee: {
      id: "user1",
      name: "User 1",
      profilePic: "",
      email: "user@mail.com",
    },
  },
];

export default function ({ loaderData: { project } }) {
  return (
    <div className="flex h-full">
      <div className="flex-1 p-8">
        <div className="flex flex-col items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{project.name}</h2>
            {/* <p className="text-muted-foreground">See your team members here.</p> */}
          </div>
          {tasks.length > 0 && (
            <div className="flex gap-4 items-center">
              <div className="mt-1 relative">
                <Input className="peer pe-9" placeholder="Search task..." />
                <Button
                  variant="ghost"
                  className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
                >
                  <Search size={16} aria-hidden="true" />
                </Button>
              </div>
              <Button className="cursor-pointer">
                <Plus />
                Add new task
              </Button>
            </div>
          )}
          <div className="mt-12 w-full">
            {tasks.length > 0 ? (
              <Fragment>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Tasks</h2>
                  <div className="mt-1 relative">
                    <Input className="peer pe-9" placeholder="Search task..." />
                    <Button
                      variant="ghost"
                      className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
                    >
                      <Search size={16} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Tabs defaultValue={tasksTabs[0].value}>
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
                    {tasksTabs.map((tab, index) => (
                      <TabsContent
                        key={index}
                        value={tab.value}
                        className="mt-8 grid grid-cols-3 gap-8"
                      >
                        {tasks.map((task) => (
                         <TaskCard key={task.id} title={task.title} description={task.description} />
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </Fragment>
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
      <div className="w-lg bg-accent/10">
        <div className="p-8">
          <h2 className="text-lg font-medium">Summary</h2>
        </div>
        <div></div>
      </div>
    </div>
  );
}
