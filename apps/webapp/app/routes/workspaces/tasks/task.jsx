import { Link, useFetcher, useOutletContext, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, formatDistanceToNow } from "date-fns";
import {
  Info,
  CalendarDays,
  Clock,
  ClockAlert,
  AlarmClockCheck,
  Pen,
  Trash,
  ChevronRight,
  Clock1,
  Eye,
  CircleCheck,
} from "lucide-react";
import { RiSendPlaneFill } from "react-icons/ri";
import QueryString from "qs";
import { auth } from "@/lib/auth";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { Separator } from "@/components/ui/separator";

import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/contexts/auth";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePicker from "@/components/date-picker";
import { useState } from "react";

export const loader = auth(async function ({ params: { taskId }, fc }) {
  const { task } = await fc.get(
    `/tasks/${taskId}?${QueryString.stringify({
      include: ["createdBy"],
    })}`
  );

  const { comments } = await fc.get(
    `/comments?${QueryString.stringify({
      include: ["createdBy"],
    })}`
  );

  return { task, comments };
});

export default function Task({
  params: { workspaceId, projectId, taskId },
  loaderData: { task, comments },
}) {
  const fetcher = useFetcher();

  const { project } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    defaultValues: {
      title: task.title,
      description: task.description,
    },
    resolver: zodResolver(
      z.object({
        title: z.string().nonempty("Title is required"),
        description: z.string().optional(),
      })
    ),
    mode: "onTouched",
  });

  function onSubmit(data) {
    fetcher.submit(
      {
        ...data,
        taskId,
      },
      {
        action: `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
        method: "patch",
        encType: "application/json",
      }
    );
    setIsEditing(false);
  }

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="text-xs bg-card h-8 px-5 border rounded-md">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/workspaces/${workspaceId}/projects/${projectId}`}>
                    {project.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem
                className="text-primary font-medium max-w-40"
                asChild
              >
                <p className="truncate">{task.title}</p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            {isEditing ? (
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={!form.formState.isDirty || !form.formState.isValid}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => setIsEditing(true)} // Enter edit mode
              >
                <Pen className="size-3" />
                Edit
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CardTitle asChild>
                            <input
                              {...field}
                              className="w-full focus-within:outline-none"
                            />
                          </CardTitle>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormControl>
                          <CardDescription asChild>
                            <textarea
                              {...field}
                              className="w-full focus-within:outline-none max-h-30"
                              placeholder="Add description here..."
                            />
                          </CardDescription>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : (
              <>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </>
            )}
          </CardHeader>
        </Card>
        <div className="px-2 mt-10">
          <div className="flex gap-2 items-center">
            <h2 className="text-sm font-medium">Comments</h2>
            <Badge className="size-5 px-1 text-[0.65rem] rounded-full">
              {comments.length}
            </Badge>
          </div>
          <div className="mt-8">
            {!!comments.length ? (
              <Timeline>
                {comments.map((comment) => (
                  <TimelineItem
                    key={comment.id}
                    step={comment.id}
                    className="group-data-[orientation=vertical]/timeline:ms-12 group-data-[orientation=vertical]/timeline:not-last:pb-12"
                  >
                    <TimelineHeader>
                      <TimelineSeparator />
                      <TimelineIndicator className="grid place-content-center size-fit border-none">
                        <Avatar className="size-7 text-[0.65rem]">
                          <AvatarImage
                            src={comment.createdBy.profilePic}
                            alt={comment.createdBy?.name}
                          />
                          <AvatarFallback className="bg-gray-200">
                            {comment.createdBy?.name
                              .split(" ")
                              .map((chunk) => chunk[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </TimelineIndicator>
                      <TimelineTitle className="text-xs">
                        {comment.createdBy.name}
                      </TimelineTitle>
                      <TimelineDate className="text-muted-foreground italic font-normal">
                        {formatDistanceToNow(comment.updatedAt, {
                          addSuffix: true,
                        })}
                      </TimelineDate>
                    </TimelineHeader>
                    <TimelineContent className="text-xs text-foreground mt-1.5">
                      {comment.content}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <p className="text-xs text-muted-foreground">No comments yet</p>
            )}
          </div>
        </div>
        <CommentForm />
      </div>
      <InfoCard task={task} />
    </div>
  );
}

function SelectStatus({ defaultValue }) {
  const fetcher = useFetcher();
  const { workspaceId, projectId, taskId } = useParams();

  function updateStatus(value) {
    console.log(value);
    fetcher.submit(
      {
        status: value,
        taskId,
      },
      {
        action: `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
        method: "patch",
        encType: "application/json",
      }
    );
  }

  const items = [
    {
      label: (
        <>
          <AlarmClockCheck className="size-4 text-cyan-500" />
          Todo
        </>
      ),
      value: "TODO",
    },
    {
      label: (
        <>
          <Clock1 className="size-4 text-amber-500" />
          In Progress
        </>
      ),
      value: "IN_PROGRESS",
    },
    {
      label: (
        <>
          <Eye className="size-4 text-orange-500" />
          Review
        </>
      ),
      value: "REVIEW",
    },
    {
      label: (
        <>
          <ClockAlert className="size-4 text-red-500" />
          Overdue
        </>
      ),
      value: "BACKLOG",
    },
    {
      label: (
        <>
          <CircleCheck className="size-4 text-emerald-500" />
          Done
        </>
      ),
      value: "DONE",
    },
  ];

  return (
    <Select onValueChange={updateStatus} defaultValue={defaultValue}>
      <SelectTrigger className="text-xs min-w-40">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {items.map((item) => (
          <SelectItem className="text-xs flex gap-2" value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SelectPriority({ defaultValue }) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger className="text-xs min-w-30">
        <SelectValue />
      </SelectTrigger>
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
  );
}

function CommentForm() {
  const fetcher = useFetcher();

  const schema = z.object({
    content: z.string().nonempty(),
  });

  const form = useForm({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  function onSubmit(data) {
    fetcher.submit(
      {
        ...data,
        task: taskId,
      },
      {
        action: `/comments`,
        method: "post",
        encType: "application/json",
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
        <fieldset>
          <Card className="mt-8">
            <CardContent className="px-4 flex gap-4 items-start">
              <Avatar className="size-10 ring ring-card text-xs rounded-md">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Test User"
                />
                <AvatarFallback>
                  {"Test User"
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 relative">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Textarea
                          placeholder="Leave a comment"
                          className="field-sizing-content min-h-12 resize-y shadow-none border-none focus-visible:border-none focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {isDirty && isValid && (
                  <Button
                    variant="ghost"
                    className="absolute right-4 bottom-4 hover:bg-transparent hover:text-emerald-500"
                  >
                    <RiSendPlaneFill className="size-6" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </fieldset>
      </form>
    </Form>
  );
}

function InfoCard({ task }) {
  const { user } = useAuth();

  return (
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
        {/* Owner Info */}
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage alt={task.createdBy?.name} />
            <AvatarFallback>{task.createdBy?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xs font-medium">
              {task.createdBy.id === user.id ? "You" : task.createdBy?.name}
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
            <div>{format(task.createdAt, "d MMM yyyy, h:mm a")}</div>
          </div>
        </div>

        {/* Updated */}
        <div className="flex items-start gap-2">
          <Clock className="size-4 text-muted-foreground mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="text-muted-foreground">Last Updated</div>
            <div>{format(task.updatedAt, "d MMM yyyy, h:mm a")}</div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-6">
          <div className="text-xs space-y-1 flex flex-col">
            <Label htmlFor="priority" className="text-xs text-muted-foreground">
              Priority
            </Label>
            <SelectPriority defaultValue={task.priority} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="text-xs space-y-1 flex flex-col">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <SelectStatus defaultValue={task.status} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="text-xs space-y-1 flex flex-col">
            <Label className="text-xs text-muted-foreground">Due Date</Label>
            <div className="flex justify-between items-center">
              {task.dueDate ? (
                <time dateTime={task.dueDate}>
                  {format(task.dueDate, "d MMM yyyy")}
                </time>
              ) : (
                "No due date"
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <CalendarDays />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-fit" align="end">
                  <DatePicker className="border-none" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="text-xs bg-destructive/70 w-full">
          <Trash className="size-3" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
