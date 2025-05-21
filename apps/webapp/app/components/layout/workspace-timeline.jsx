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
import { auth } from "@/lib/contexts/auth";
import { User } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const messages = new Map([
  ["create", "created this workspace."],
  ["update", "modified this workspace details."],
]);

function getMessage(event, user) {
  return (
    <div>
      <Button asChild variant="link" className="p-0 h-fit">
        <Link to="">
          {event.createdBy.id === user.id ? "You" : event.createdBy.name}
        </Link>
      </Button>{" "}
      <span className="text-muted-foreground text-sm font-normal">
        {messages.get(event.action)}
      </span>
    </div>
  );
}

export function WorkspaceTimeline({ events }) {
  const { user } = auth();

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const date = format(new Date(event.createdAt), "d MMMM yyyy");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  // Create a flat list of timeline items (date and events)
  const timelineItems = [];
  Object.keys(groupedEvents)
    .sort((a, b) => new Date(b) - new Date(a)) // Sort dates in descending order
    .forEach((date) => {
      // Add date item
      timelineItems.push({
        type: "date",
        key: date,
        date,
      });
      // Add event items for this date
      groupedEvents[date].forEach((event) => {
        timelineItems.push({
          type: "event",
          key: event.id,
          event,
        });
      });
    });

  return (
    <Timeline>
      {timelineItems.map((item) => (
        item.type === "date" ? (
          <TimelineItem
            key={item.key}
            step={item.key}
            className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-8 not-first:-mt-7"
          >
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineContent className="mt-12">
              <TimelineTitle>
                <time className="text-foreground font-medium">{item.date}</time>
              </TimelineTitle>
            </TimelineContent>
          </TimelineItem>
        ) : (
          <TimelineItem
            key={item.key}
            step={item.key}
            className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-10"
          >
            <TimelineHeader>
              <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
              <TimelineTitle className="mt-0.5 flex items-center justify-between">
                {getMessage(item.event, user)}
                <TimelineDate>
                  {format(new Date(item.event.createdAt), "h:mm a")}
                </TimelineDate>
              </TimelineTitle>
              <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                <User className="size-3" />
              </TimelineIndicator>
            </TimelineHeader>
          </TimelineItem>
        )
      ))}
    </Timeline>
  );
}