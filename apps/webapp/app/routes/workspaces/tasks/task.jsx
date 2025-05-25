import { Link, useFetcher } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RiSendPlaneFill } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import QueryString from "qs";

export const loader = auth(async function ({ params: { taskId }, fc }) {
  const { task } = await fc.get(`/tasks/${taskId}`);
  const { comments } = await fc.get(
    `/comments?${QueryString.stringify({
      include: ["createdBy"],
    })}`
  );

  return { task, comments };
});

const comments = [
  // {
  //   id: "1",
  //   data: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti placeat eveniet natus culpa ea expedita, voluptatum harum quos mollitia in inventore, hic id quasi tempore provident error quae at temporibus.",
  //   createdAt: new Date().toString(),
  //   updatedAt: new Date().toString(),
  //   createdBy: {
  //     id: "u1",
  //     name: "Test User",
  //     profilePic: "https://github.com/shadcn.png",
  //   },
  // },
  // {
  //   id: "2",
  //   data: "this is test comment",
  //   updatedAt: new Date().toString(),
  //   createdAt: new Date().toString(),
  //   createdBy: {
  //     id: "u1",
  //     name: "Test User",
  //     profilePic: "",
  //   },
  // },
  // {
  //   id: "3",
  //   data: "this is test comment",
  //   updatedAt: new Date().toString(),
  //   createdAt: new Date().toString(),
  //   createdBy: {
  //     id: "u1",
  //     name: "Test User",
  //     profilePic: "https://github.com/shadcn.png",
  //   },
  // },
];

const schema = z.object({
  content: z.string().nonempty(),
});

export default function Task({
  params: { workspaceId, projectId, taskId },
  loaderData: { task, comments },
}) {
  const fetcher = useFetcher();

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
    <div className="flex flex-1">
      <div className="px-8 space-y-4 flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/workspaces/${workspaceId}/projects/${projectId}`}>
                  {projectId}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-primary font-medium">
              {task.title}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge
              size="sm"
              className="text-xs px-3 py-1 rounded-full bg-destructive/5 text-destructive/80"
            >
              <span className="size-1.5 bg-destructive/80 mr-1 rounded-full"></span>
              Overdue
            </Badge>
          </CardContent>
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
        </div>
      </div>
      <Card className="w-2xs">
        <CardHeader>Activity</CardHeader>
      </Card>
    </div>
  );
}
