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
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AddMembersCard } from "@/components/features/add-members";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
      <div className="px-6 space-y-3 flex-1">
        <div className="flex justify-between items-center">
          <Breadcrumb className="py-3">
            <BreadcrumbList>
              <BreadcrumbItem className="text-primary font-medium">
                Members
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-1 relative">
            <Input
              className="peer pe-9 bg-background w-48 h-9"
              placeholder="Search member..."
            />
            <Button
              variant="ghost"
              className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer h-9"
            >
              <Search size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-3 items-start">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <AddMembersCard />
    </div>
  );
}

function MemberCard({ member: { user, role } }) {
  return (
    <Card className="py-3 rounded-md transition-all">
      <CardHeader className="flex justify-between px-3">
        <div className="flex gap-2">
          <Avatar className="rounded-md">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs">
              {user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <CardTitle className="text-xs">{user.name}</CardTitle>
            <CardDescription className="text-xs italic capitalize">
              {role.toString().toLowerCase()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
