import QueryString from "qs";
import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AddMember } from "@/components/shared/add-members";
import { Search } from "lucide-react";
import { Link } from "react-router";

export const loader = auth(async function ({
  params: { workspaceId },
  session,
}) {
  const { members } = await api.get(
    `/members?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
      include: "user",
    })}`,
    {
      session,
    }
  );

  const { users } = await api.get("/users", { session });

  const memberUserIds = new Set(members.map((member) => member.user.id));

  return {
    members,
    users: users.filter((user) => !memberUserIds.has(user.id)),
  };
});

export default function WorkspaceMembers({
  loaderData: { members, users },
  params: { workspaceId },
}) {
  return (
    <div className="h-full flex justify-between">
      <ScrollArea className="h-full flex-1">
        <div className="py-8 px-16 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">Members</h2>
              <p className="text-muted-foreground">
                See your team members here.
              </p>
            </div>
            <div className="mt-1 relative">
              <Input className="peer pe-9" placeholder="Search member..." />
              <Button
                variant="ghost"
                className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
              >
                <Search size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="font-medium">Recently added</h3>
            <div className="grid grid-cols-3 mt-6 gap-6">
              {members.map(({ id, user }) => (
                <Link key={id} to={`/workspaces/${workspaceId}/members/${id}`}>
                  <Card className="p-4">
                    <CardHeader className="flex p-0 justify-between">
                      <div className="flex gap-2">
                        <Avatar className="size-9">
                          <AvatarImage alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(" ")
                              .map((chunk) => chunk[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5">
                          <CardTitle className="text-sm">{user.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {user.email}
                          </CardDescription>
                        </div>
                      </div>
                      {/* <Button size="sm" className="text-xs h-7">
                        View
                      </Button> */}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="w-xl bg-accent/10">
        <div className="p-8">
          <h2 className="text-lg font-medium">Add members</h2>
          <AddMember users={users} />
        </div>
      </div>
    </div>
  );
}
