import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { redirect, useFetcher, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import QueryString from "qs";

import { auth } from "@/lib/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export const loader = auth(async function ({ fc, params: { workspaceId } }) {
  const { members } = await fc.get(
    `/members?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
      include: "user",
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

  function onSubmit(data) {
    fetcher.submit(
      {
        ...data,
        assignee: members[0].id
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
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  return (
    <div className="p-8 max-w-lg">
      <h2 className="text-xl font-bold">Create task</h2>
      <div className="mt-8">
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

                  {/* <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignee</FormLabel>
                        <Popover>
                          <PopoverTrigger>
                            <div className="flex gap-2 items-center text-sm">
                              <Avatar className="size-8 ring ring-card text-xs">
                                <AvatarImage
                                  src="https://github.com/shadcn.png"
                                  alt=""
                                />
                                <AvatarFallback>A</AvatarFallback>
                              </Avatar>
                              Josh Er
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <div className="relative">
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
                            <ScrollArea className="max-h-36 flex flex-col">
                              {members.map(({ id, user }) => (
                                <div
                                  className="flex gap-2 items-center text-sm p-2"
                                  key={id}
                                >
                                  <Avatar className="size-9">
                                    <AvatarImage alt={user.name} />
                                    <AvatarFallback className="text-xs">
                                      {user.name
                                        .split(" ")
                                        .map((chunk) => chunk[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  {user.name}
                                </div>
                              ))}
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
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
      </div>
    </div>
  );
}
