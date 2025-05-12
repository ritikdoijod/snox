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
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-3">
          {members?.map((member) => (
            <Avatar key={member.id} className="size-6">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
