import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function WorkspaceCard({ name, description, members }) {
  return (
    <Card className="min-h-40">
      <CardHeader className="h-16">
        <CardTitle className="flex items-center gap-3">
              <div className="bg-accent flex aspect-square size-8 items-center justify-center rounded-lg">
                {name[0].toUpperCase()}
              </div>
              {name}
            </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-3">
          {members?.map((member) => (
            <Avatar key={member.id} className="size-9 ring ring-card">
              <AvatarImage
                src={member.user.profilePic}
                alt={member.user.name}
              />
              <AvatarFallback className="text-xs">
                {member.user.name
                  .split(" ")
                  .map((chunk) => chunk[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          ))}
          {members.length > 4 && (
            <Avatar className="size-9 ring-2 ring-card text-muted-foreground">
              <AvatarImage src="counter" alt="counter" />
              <AvatarFallback className="text-xs">
                {members.length - 4}+
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
