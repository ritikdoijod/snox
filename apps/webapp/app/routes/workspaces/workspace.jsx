import { format } from "date-fns";
import { Link, useOutletContext } from "react-router";
import QueryString from "qs";
import { auth } from "@/lib/auth";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const loader = auth(async function ({ params: { workspaceId }, fc }) {
  const { projects } = await fc.get(
    `/projects?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
      sort: "-createdAt",
    })}`
  );

  const { members } = await fc.get(
    `/members?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
      include: "user",
    })}`
  );

  return { projects, members };
});

export default function Workspace({ loaderData: { projects, members } }) {
  const { workspace } = useOutletContext();

  return (
    <div className="flex flex-1">
      <div className="px-8 space-y-6 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>{workspace.name}</CardTitle>
            <CardDescription>{workspace.description}</CardDescription>
            <CardContent className="pb-20"></CardContent>
          </CardHeader>
        </Card>
        <div className="space-y-12">
          <div className="space-y-3">
            <h2 className="ms-1 text-sm font-medium">Recent Projects</h2>
            <div className="grid gap-4 grid-cols-2">
              {projects.map((project) => (
                <Card className="py-4">
                  <CardHeader className="px-4">
                    <CardTitle className="text-xs font-medium">{project.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="ms-1 text-sm font-medium">New members</h2>
            <div className="grid gap-4 grid-cols-2">
              {members.map(({ id, user }) => (
                <Link key={id} to={`/workspaces/${workspace.id}/members/${id}`}>
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
                          <CardTitle className="text-xs font-medium">{user.name}</CardTitle>
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
          <CardTitle className="text-sm">Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="">
            <div className="text-sm">Created</div>
            <time
              datetime={workspace.createdAt}
              className="text-xs text-muted-foreground"
            >
              {format(workspace.createdAt, "d MMMM yyyy h:mm a")}
            </time>
          </div>
          <div>
            <div className="text-sm">Updated</div>
            <time
              datetime={workspace.createdAt}
              className="text-xs text-muted-foreground"
            >
              {format(workspace.updatedAt, "d MMMM yyyy h:mm a")}
            </time>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
