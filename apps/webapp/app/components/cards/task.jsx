import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export function TaskCard({ task: { title, description, status, assignee } }) {
  return (
    <Card className="relative group cursor-pointer">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>{" "}
      </CardHeader>
      <Button
        variant="ghost"
        className="hidden group-hover:block cursor-pointer absolute right-0 top-0 hover:bg-transparent dark:hover:bg-transparent text-muted-foreground"
      >
        <ExternalLink />
      </Button>
      <CardContent className="flex gap-2 items-center">
        <Badge
          size="sm"
          className="text-xs px-3 py-1 rounded-full bg-destructive/10 text-destructive"
        >
          <span className="size-1.5 bg-destructive mr-1 rounded-full"></span>
          Overdue
        </Badge>

        <Avatar className="size-8 ring ring-card text-xs">
          <AvatarImage src={assignee.profilePic} alt={assignee.name} />
          <AvatarFallback>
            {assignee.name
              .split(" ")
              .map((chunk) => chunk[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
}
