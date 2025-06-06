import { Link, useOutletContext } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {  useFetcher, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import QueryString from "qs";

import { auth } from "@/lib/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY, STATUS } from "@/utils/constants";
import { useWorkspace } from "../context";

export const loader = auth(async function ({ fc, params: { workspaceId } }) {
  const { members } = await fc.get(
    `/members?${QueryString.stringify({
      filters: [
        {
          $match: {
            workspace: workspaceId,
          },
        },
      ],
      include: ["user"],
    })}`
  );

  return { members };
});

const schema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  priority: z.enum(Object.values(PRIORITY)).optional(),
});

export default function CreateTask({ loaderData: { members } }) {
  const { workspaceId, projectId } = useParams();
  const fetcher = useFetcher();
  const { project } = useOutletContext();
  const { userMember } = useWorkspace();

  function onSubmit(data) {
    fetcher.submit(
      {
        ...data,
        assignee: members[0].id,
      },
      {
        method: "post",
        action: `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
        encType: "application/json",
      }
    );
  }

  useEffect(() => {
    if (fetcher?.data?.error) toast(fetcher?.data?.error?.message);
  }, [fetcher?.data]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: PRIORITY.LOW,
      assignee: userMember.id,
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-3 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to={`/workspaces/${workspaceId}/projects/${projectId}`}
                      >
                        {project.name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="text-primary font-medium">
                    Create new task
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset disabled={fetcher.state === "submitting"}>
                  <div className="grid gap-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Description
                            <span className="text-muted-foreground text-xs font-light italic">
                              (Optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} className="min-h-24" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="text-xs min-w-30">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem className="text-xs" value="LOW">
                                  <span className="size-1.5 bg-cyan-500 rounded-full"></span>
                                  Low
                                </SelectItem>
                                <SelectItem className="text-xs" value="MEDIUM">
                                  {" "}
                                  <span className="size-1.5 bg-amber-500 rounded-full"></span>
                                  Medium
                                </SelectItem>
                                <SelectItem className="text-xs" value="HIGH">
                                  {" "}
                                  <span className="size-1.5 bg-red-500 rounded-full"></span>
                                  High
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assignee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assignee</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="text-xs min-w-40 px-0 border-none">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <div className="relative px-2">
                                  <Input
                                    className="peer pe-9 rounded-none bg-inherit dark:bg-inherit focus-visible:ring-0 border-none shadow-none"
                                    placeholder="Search member..."
                                  />
                                  <Button
                                    variant="ghost"
                                    className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
                                  >
                                    <Search size={16} aria-hidden="true" />
                                  </Button>
                                </div>
                                <Separator />
                                <ScrollArea className="max-h-36 flex flex-col mt-2">
                                  {members.map(({ id, user }) => (
                                    <SelectItem
                                      key={id}
                                      className="text-xs"
                                      value={id}
                                    >
                                      <Avatar className="size-6 rounded-sm">
                                        <AvatarImage
                                          src={user.avatar}
                                          alt={user.name}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {user.name[0].toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      {user.name}
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {fetcher.state === "submitting" ? (
                      <Button disabled className="cursor-pointer">
                        <Loader2 className="animate-spin" />
                        Creating task...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!isDirty || !isValid}
                        className="cursor-pointer"
                      >
                        Create task
                      </Button>
                    )}
                  </div>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Card className="w-2xs"></Card>
    </div>
  );
}
