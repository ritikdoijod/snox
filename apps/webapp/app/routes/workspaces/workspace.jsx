import { format } from "date-fns";
import { Link, useFetcher } from "react-router";
import {
  Folders,
  UsersRound,
  CalendarDays,
  Clock,
  Lock,
  Globe,
  ShieldCheck,
  Pencil,
  Info,
  Trash,
  UserRoundCog,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/contexts/auth";
import { auth } from "@/lib/auth";
import { RolePermissions } from "@/utils/role-permission";
import { Permissions } from "@/enums/role";
import { useWorkspace } from "./context";

export const loader = auth(async function () {
  return {};
});

export default function Workspace({ params: { workspaceId } }) {
  const { workspace, projects, members, userRole, userMember } = useWorkspace();
  const { user } = useAuth();

  const fetcher = useFetcher();

  function leaveWorkspace() {
    fetcher.submit(
      {
        memberId: userMember.id,
      },
      {
        action: `/workspaces/${workspaceId}/members`,
        method: "delete",
        encType: "application/json",
      }
    );
  }

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-6 flex-1">
        <Card>
          <CardHeader className="gap-3">
            <CardTitle className="flex items-center gap-3">
              <Avatar className="rounded-md">
                <AvatarImage src={workspace.avatar} />
                <AvatarFallback className="rounded-md">
                  {workspace.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {workspace.name}
            </CardTitle>
            <CardDescription>{workspace.description}</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex gap-6">
            <Link to={`/workspaces/${workspaceId}/projects`}>
              <div className="px-4 py-3 border rounded-xl min-w-40">
                <h3 className="text-xs font-medium flex items-center justify-between gap-2">
                  Projects{" "}
                  <span className="text-cyan-500">
                    <Folders className="size-5" />
                  </span>
                </h3>
                <p className="mt-1 text-2xl font-semibold">{projects.length}</p>
              </div>
            </Link>

            <Link to={`/workspaces/${workspaceId}/members`}>
              <div className="px-4 py-3 border rounded-xl min-w-40">
                <h3 className="text-xs font-medium flex items-center justify-between gap-2">
                  Members{" "}
                  <span className="text-emerald-500">
                    <UsersRound className="size-5" />
                  </span>
                </h3>
                <p className="mt-1 text-2xl font-semibold">{members.length}</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        <div className="space-y-12">
          <div className="space-y-3">
            <h2 className="ms-1 text-sm font-medium">Recent Projects</h2>
            <div className="grid gap-4 grid-cols-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/workspaces/${workspaceId}/projects/${project.id}`}
                >
                  <Card className="py-4 gap-3">
                    <CardHeader className="px-4">
                      <CardTitle className="text-xs font-medium flex gap-2 items-center">
                        <Avatar className="size-5 rounded-sm">
                          <AvatarImage src={project.avatar} />
                          <AvatarFallback className="rounded-sm">
                            {project.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4">
                      <div className="flex gap-1 items-center">
                        <Avatar className="size-5">
                          <AvatarImage src={project.createdBy.avatar} />
                          <AvatarFallback className="text-[0.55rem]">
                            {project.createdBy.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs">{project.createdBy.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="ms-1 text-sm font-medium">New members</h2>
            <div className="grid gap-4 grid-cols-2">
              {members.map(({ id, user }) => (
                <Link key={id} to={`/workspaces/${workspace.id}/members/${id}`}>
                  <Card className="py-4">
                    <CardHeader className="flex px-4 justify-between">
                      <div className="flex gap-2">
                        <Avatar className="size-5 rounded-sm">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-[0.55rem] rounded-sm">
                            {user.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5">
                          <CardTitle className="text-xs font-medium">
                            {user.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {user.email}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Card className="w-2xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>
              <Info className="size-5" />
            </span>
            Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          {/* Owner */}
          <div className="flex items-start gap-2">
            <UserRoundCog className="size-4 text-muted-foreground" />
            <div className="text-xs space-y-1">
              <div className="text-muted-foreground">Owner</div>
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage
                    src={workspace.createdBy.avatar}
                    alt={workspace.createdBy.name}
                  />
                  <AvatarFallback>{workspace.createdBy.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-xs font-medium">
                  {workspace.createdBy.id === user.id
                    ? "You"
                    : workspace.createdBy.name}
                </div>
              </div>
            </div>
          </div>

          {/* Created */}
          <div className="flex items-start gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />
            <div className="text-xs space-y-1">
              <div className="text-muted-foreground">Created</div>
              <div>{format(workspace.createdAt, "d MMM yyyy, h:mm a")}</div>
            </div>
          </div>

          {/* Updated */}
          <div className="flex items-start gap-2">
            <Clock className="size-4 text-muted-foreground mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="text-muted-foreground">Updated</div>
              <div>{format(workspace.updatedAt, "d MMM yyyy, h:mm a")}</div>
            </div>
          </div>

          <Separator />

          {/* Your Role */}

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4" />
              <span>
                You are a <strong>{userRole.toLowerCase()}</strong>
              </span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            {RolePermissions[userRole].includes(Permissions.EDIT_WORKSPACE) ? (
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-2"
                asChild
              >
                <Link to={`/workspaces/${workspaceId}/settings`}>
                  <Pencil className="size-3" />
                  Edit
                </Link>
              </Button>
            ) : null}

            {RolePermissions[userRole].includes(
              Permissions.DELETE_WORKSPACE
            ) ? (
              <Button
                size="sm"
                className="bg-destructive/50 hover:bg-destructive/80 cursor-pointer text-xs"
                asChild
              >
                <Link to={`/workspaces/${workspaceId}/settings`}>
                  <Trash className="size-3" />
                  Delete
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-destructive/50 hover:bg-destructive/80 cursor-pointer text-xs ml-auto"
                onClick={leaveWorkspace}
              >
                Leave
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
