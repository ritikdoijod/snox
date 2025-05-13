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
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-3">
          {members?.map((member) => (
            <Avatar key={member.id} className="size-10 ring ring-card">
              <AvatarImage src={member.user.profilePic} alt={member.user.name} />
              <AvatarFallback>{member.user.name.split(" ").map(chunk => chunk[0]).join("")}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar className="size-10 ring-2 ring-card text-muted-foreground">
              <AvatarImage src="counter" alt="counter" />
              <AvatarFallback>+3</AvatarFallback>
            </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}
