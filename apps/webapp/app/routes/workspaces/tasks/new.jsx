import { Link, useOutletContext } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import QueryString from "qs";
import { CalendarIcon, Loader2, Search } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
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
import { PRIORITY } from "@/utils/constants";
import { format, addDays, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth";

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
  assignee: z.string().min(1, "Assignee is required"),
  dueDate: z.any(),
});

export default function CreateTask({ loaderData: { members } }) {
  const { workspaceId, projectId } = useParams();
  const fetcher = useFetcher();
  const { project } = useOutletContext();
  const { user } = useAuth();

  function onSubmit(data) {
    data = JSON.parse(JSON.stringify(data));
    fetcher.submit(data, {
      method: "post",
      action: `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
      encType: "application/json",
    });
  }

  useEffect(() => {
    if (fetcher?.data?.error) toast(fetcher?.data?.error?.message);
  }, [fetcher?.data]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: PRIORITY.LOW,
      assignee: user.id,
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  return (
    <div className="flex-1 flex">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="size-full">
          <fieldset
            disabled={fetcher.state === "submitting"}
            className="size-full flex"
          >
            <div className="px-6 space-y-3 flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Task</CardTitle>
                </CardHeader>
                <CardContent>
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
                    <div className="grid grid-cols-3 gap-6"></div>

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
                </CardContent>
              </Card>
            </div>
            <Card className="w-2xs">
              <CardContent className="space-y-6">
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormDescription>{project.name}</FormDescription>
                </FormItem>
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
                          <SelectTrigger className="text-xs min-w-40">
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
                                value={user.id}
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

                <DueDatePicker form={form} />
              </CardContent>
            </Card>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}

function DueDatePicker({ form }) {
  const today = new Date();
  const tomarrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const nextMonth = addMonths(today, 1);
  const [dueDate, setDueDate] = useState(form.watch("dueDate") || null);

  return (
    <FormField
      control={form.control}
      name="dueDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Due Date</FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "px-3 font-normal text-xs hover:bg-transparent cursor-pointer flex justify-between w-full border",
                  !dueDate && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>No due date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit flex gap-3" align="end">
              <FormControl>
                <Calendar
                  mode="single"
                  selected={dueDate || today}
                  onSelect={setDueDate}
                  month={dueDate || today}
                  onMonthChange={setDueDate}
                  className="p-0"
                  disabled={[
                    { before: today }, // Dates before today
                  ]}
                />
              </FormControl>
              <Separator orientation="vertical" />
              <div className="flex flex-col">
                <div className="flex flex-col px-2 flex-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDueDate(today);
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDueDate(tomarrow);
                    }}
                  >
                    Tomorrow
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDueDate(nextWeek);
                    }}
                  >
                    Next week
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDueDate(nextMonth);
                    }}
                  >
                    Next month
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <PopoverClose asChild>
                    <Button size="sm" variant="secondary">
                      Close
                    </Button>
                  </PopoverClose>
                  <Button size="sm" onClick={() => field.onChange(dueDate)}>
                    Ok
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
