import { useFetcher, useParams } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export function AddMemberCard({ user }) {
  const fetcher = useFetcher();
  const { workspaceId } = useParams();

  async function onSubmit() {
    fetcher.submit(
      {
        user: user.id,
        workspace: workspaceId,
        permissions: ["VIEW_ONLY"],
      },
      {
        action: `/workspaces/${workspaceId}/members`,
        method: "post",
        encType: "application/json",
      }
    );
  }

  return (
    <Card key={user.id} className="p-2 rounded-md">
      <CardHeader className="flex p-0 justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarImage alt={user.name} />
            <AvatarFallback className="text-[0.65rem]">
              {user.name
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <CardTitle className="text-xs">{user.name}</CardTitle>
            <CardDescription className="text-xs">{user.email}</CardDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          className="size-7 cursor-pointer p-2"
          onClick={onSubmit}
        >
          <Plus />
        </Button>
      </CardHeader>
    </Card>
  );
}
