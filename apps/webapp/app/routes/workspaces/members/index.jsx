import { useFetcher, useParams, useLoaderData, redirect } from "react-router";
import {
  MoreHorizontal,
  MoreVertical,
  Plus,
  Search,
  Trash,
  UsersRound,
} from "lucide-react";

import { auth } from "@/lib/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Permissions, Roles } from "@/enums/role";
import { useWorkspace } from "../context";
import { RolePermissions } from "@/utils/role-permission";

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

export const loader = auth(async function ({ fc }) {
  const { users } = await fc.get("/users");

  return { users };
});

export const action = auth(async function ({
  params: { workspaceId },
  request,
  fc,
}) {
  let actionData = {};
  switch (request.method) {
    case "POST":
      const { user, role } = await request.json();
      await fc.post("/members", {
        user,
        workspace: workspaceId,
        role,
      });
      break;
    case "PATCH": {
      const { memberId, role } = await request.json();
      await fc.patch(`/members/${memberId}`, {
        role,
      });
      break;
    }
    case "DELETE": {
      const { memberId } = await request.json();
      await fc.delete(`/members/${memberId}`);
      actionData = { success: true };
      break;
    }
    default:
      throw new Error("Method not allowed");
  }
  return actionData;
});

export default function WorkspaceMembers() {
  const { members } = useWorkspace();

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-3 flex-1">
        <Card className="min-h-96">
          <CardHeader className="gap-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3">
                <UsersRound className="size-5" />
                Members
              </CardTitle>
              <div className="relative">
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
          </CardHeader>
          <CardContent>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 gap-6 items-start">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <AddMembersCard />
    </div>
  );
}

function MemberCard({ member: { id, user, role } }) {
  const fetcher = useFetcher();
  const { workspaceId } = useParams();
  const { userRole } = useWorkspace();

  function deleteMember() {
    fetcher.submit(
      {
        memberId: id,
      },
      {
        action: `/workspaces/${workspaceId}/members`,
        method: "delete",
        encType: "application/json",
      }
    );
  }

  function changeRole(newRole) {
    fetcher.submit(
      {
        memberId: id,
        role: newRole,
      },
      {
        action: `/workspaces/${workspaceId}/members`,
        method: "patch",
        encType: "application/json",
      }
    );
  }

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
            <CardDescription className="text-xs font-light capitalize">
              {role.toString().toLowerCase()}
            </CardDescription>
          </div>
        </div>
        {role !== Roles.OWNER && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-7 p-2">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Actions
              </DropdownMenuLabel>
              {RolePermissions[userRole].includes(
                Permissions.CHANGE_MEMBER_ROLE
              ) && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-xs">
                    Change role
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => changeRole(Roles.ADMIN)}>
                        Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => changeRole(Roles.MEMBER)}
                      >
                        Member
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              )}
              {RolePermissions[userRole].includes(
                Permissions.REMOVE_MEMBER
              ) && (
                <DropdownMenuItem
                  onClick={deleteMember}
                  className="cursor-pointer"
                >
                  <Trash className="me-1 size-4" />
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
    </Card>
  );
}

export function AddMemberCard({ user }) {
  const fetcher = useFetcher();
  const { workspaceId } = useParams();

  async function onSubmit() {
    fetcher.submit(
      {
        user: user.id,
        workspace: workspaceId,
        role: Roles.MEMBER,
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
        <div className="flex items-start gap-2">
          <Avatar className="size-7 rounded-sm">
            <AvatarImage alt={user.name} />
            <AvatarFallback className="text-[0.65rem]">
              {user.name[0].toUpperCase()}
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

export function AddMembersCard() {
  const { users } = useLoaderData();
  const { members } = useWorkspace();

  const memberUserIds = new Set(members.map((member) => member.user.id));

  const nonMemberUsers = users.filter((user) => !memberUserIds.has(user.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input className="peer pe-9" placeholder="Search user..." />
          <Button
            variant="ghost"
            className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
          >
            <Search size={16} aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-12 space-y-3">
          {nonMemberUsers.map((user) => (
            <AddMemberCard user={user} key={user.id} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
