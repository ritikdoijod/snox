import { Link } from "react-router";
import QueryString from "qs";

import { auth } from "@/lib/auth";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AddMembersCard } from "@/components/features/add-members";

export const loader = auth(async function ({ params: { workspaceId }, fc }) {
  const { members } = await fc.get(
    `/members?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
      include: "user",
    })}`
  );

  const { users } = await fc.get("/users");

  const memberUserIds = new Set(members.map((member) => member.user.id));

  return {
    members,
    users: users.filter((user) => !memberUserIds.has(user.id)),
  };
});

export const action = auth(async function ({
  params: { workspaceId },
  request,
  fc,
}) {
  let actionData = {};
  switch (request.method) {
    case "POST":
      const { user, permissions } = await request.json();
      await fc.post("/members", {
        user,
        workspace: workspaceId,
        permissions,
      });
      break;
    default:
      throw new Error("Method not allowed");
  }
  return actionData;
});

export default function WorkspaceMembers({
  params: { workspaceId },
  loaderData: { members, users },
}) {
  return (
    <div className="flex flex-1">
      <div className="px-8 space-y-3 flex-1">
        <Breadcrumb className="py-3">
          <BreadcrumbList>
            <BreadcrumbItem className="text-primary font-medium">
              Members
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 mt-2 gap-4">
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
        </ScrollArea>
      </div>
      <AddMembersCard />
    </div>
  );
}
