import { Link } from "react-router";
import { format, formatDistanceToNow } from "date-fns";
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

export const loader = auth(async function ({ params: { taskId }, fc }) {
  const { task } = await fc.get(`/tasks/${taskId}`);

  return { task };
});

const comments = [
  {
    id: "1",
    data: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti placeat eveniet natus culpa ea expedita, voluptatum harum quos mollitia in inventore, hic id quasi tempore provident error quae at temporibus.",
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    createdBy: {
      id: "u1",
      name: "Test User",
      profilePic: "https://github.com/shadcn.png",
    },
  },
  {
    id: "2",
    data: "this is test comment",
    updatedAt: new Date().toString(),
    createdAt: new Date().toString(),
    createdBy: {
      id: "u1",
      name: "Test User",
      profilePic: "",
    },
  },
  {
    id: "3",
    data: "this is test comment",
    updatedAt: new Date().toString(),
    createdAt: new Date().toString(),
    createdBy: {
      id: "u1",
      name: "Test User",
      profilePic: "https://github.com/shadcn.png",
    },
  },
];

export default function Task({
  params: { workspaceId, projectId, taskId },
  loaderData: { task },
}) {
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
            <Badge className="size-5 px-1 text-xs rounded-full">6</Badge>
          </div>
          <div className="mt-8">
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
                          alt={comment.createdBy.name}
                        />
                        <AvatarFallback className="bg-gray-200">
                          {comment.createdBy.name
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
                    {comment.data}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
          <Card className="border-none rounded-md mt-8">
            <CardContent className="px-4 flex gap-4 items-center">
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
              <input placeholder="Leave a comment..." className="focus-visible:outline-none" />
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="w-2xs">
        <CardHeader>Activity</CardHeader>
      </Card>
    </div>
  );
}
