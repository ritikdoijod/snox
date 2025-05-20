import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const loader = auth(async function ({ params: { taskId }, fc }) {
  const { task } = await fc.get(`/tasks/${taskId}`);

  return { task };
});

const comments = [
  {
    id: "1",
    data: "This is test comment",
    createdAt: new Date().toString(),
    createdBy: {
      id: "u1",
      name: "Test User",
      profilePic: "https://github.com/shadcn.png",
    },
  },
  {
    id: "2",
    data: "this is test comment",
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
    createdAt: new Date().toString(),
    createdBy: {
      id: "u1",
      name: "Test User",
      profilePic: "https://github.com/shadcn.png",
    },
  },
];

export default function Task({ params: { taskId }, loaderData: { task } }) {
  return (
    <div className="p-8 space-y-4 w-3xl mx-auto">
      <div className="">
        <h2 className="font-semibold text-2xl">{task.title}</h2>
        <p className="mt-2 text-foreground/90">{task.description}</p>
      </div>
      <Separator />
      <div className="">
        <h3>Comments</h3>
        <div>
          <Timeline defaultValue={comments.length - 1} className="mt-8">
            <TimelineItem className="group-data-[orientation=vertical]/timeline:ms-12">
              <TimelineHeader>
                <TimelineSeparator />
              </TimelineHeader>
              <TimelineContent className="-ms-14 z-10">
                <Card className="border-none rounded-md mb-8">
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
                    <input placeholder="Leave a comment..." className="" />
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>

            {comments.map((comment) => (
              <TimelineItem
                key={comment.id}
                step={comment.id}
                className="has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-muted group-data-[orientation=vertical]/timeline:ms-12 group-data-[orientation=vertical]/timeline:not-last:pb-20"
              >
                <TimelineHeader>
                  <TimelineSeparator className="bg-muted group-data-completed/timeline-item:bg-primary" />
                  <TimelineTitle className="">
                    {comment.data}
                    <TimelineDate>
                      {format(new Date(comment.createdAt), "h:mm a")}
                    </TimelineDate>
                  </TimelineTitle>
                  <TimelineIndicator className="grid place-content-center bg-primary group-data-completed/timeline-item:bg-primary/10">
                    <Avatar className="size-10 ring ring-card text-xs">
                      <AvatarImage
                        src={comment.createdBy.profilePic}
                        alt={comment.createdBy.name}
                      />
                      <AvatarFallback>
                        {comment.createdBy.name
                          .split(" ")
                          .map((chunk) => chunk[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TimelineIndicator>
                </TimelineHeader>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    </div>
  );
}
