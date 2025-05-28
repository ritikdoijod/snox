import { Fragment } from "react";
import { Link, redirect } from "react-router";
import { Plus, Search } from "lucide-react";
import QueryString from "qs";

import { auth } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";


export const loader = auth(async function ({ fc }) {
  const { workspaces } = await fc.get(
    `/workspaces?${QueryString.stringify({ include: ["members"] })}`
  );

  return { workspaces };
});

export const action = auth(async function ({ request, params, fc }) {
  let actionData = {};

  switch (request.method) {
    case "POST": {
      const { name, description, avatar } = await request.json();
      const { workspace } = await fc.post("/workspaces", {
        name,
        description,
        avatar,
      });
      actionData = { workspace };
      break;
    }

    case "PATCH": {
      const { name, description, avatar, workspaceId } = await request.json();
      const { workspace } = await fc.patch(`/workspaces/${workspaceId}`, {
        name,
        description,
        avatar,
      });
      actionData = { workspace };
      break;
    }

    case "DELETE": {
      const { workspaceId } = await request.json();
      await fc.delete(`/workspaces/${workspaceId}`);
      actionData = redirect("/workspaces");
      break;
    }

    default: {
      actionData = { error: { message: "Method not allowed" } };
      break;
    }
  }

  return actionData;
});

export default function Workspaces({ loaderData: { workspaces } }) {
  return (
    <div className="px-8 py-12">
      {workspaces.length > 0 ? (
        <Fragment>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Workspaces</h2>
            <div className="mt-1 relative">
              <Input
                className="peer pe-9 bg-background w-48 h-9"
                placeholder="Search workspace..."
              />
              <Button
                variant="ghost"
                className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer h-9"
              >
                <Search size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-8">
            {workspaces.map((workspace) => (
              <Link to={`/workspaces/${workspace.id}`} key={workspace.id}>
                <Card className="min-h-40">
                  <CardHeader className="h-16">
                    <CardTitle className="flex items-center gap-3">
                      <Avatar className="rounded-md">
                        <AvatarImage
                          src={workspace.avatar}
                        />
                        <AvatarFallback className="rounded-md">
                          {workspace.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {workspace.name}
                    </CardTitle>
                    <CardDescription>{workspace.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-3">
                      {workspace?.members?.map((member) => (
                        <Avatar
                          key={member.id}
                          className="size-9 ring ring-card"
                        >
                          <AvatarImage
                            src={member.user.profilePic}
                            alt={member.user.name}
                          />
                          <AvatarFallback className="text-xs">
                            {member.user.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {workspace?.members.length > 4 && (
                        <Avatar className="size-9 ring-2 ring-card text-muted-foreground">
                          <AvatarImage src="counter" alt="counter" />
                          <AvatarFallback className="text-xs">
                            {workspace?.members.length - 4}+
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Fragment>
      ) : (
        <div className="grid gap-8 p-8 place-content-center border border-dashed rounded-lg">
          <div className="flex flex-col items-center gap-8">
            <p className="text-center">
              Start by creating your first workspace
            </p>
            <Button asChild>
              <Link to="/workspaces/new">
                <Plus />
                Create workspace
              </Link>
            </Button>
          </div>
          <div className="flex gap-4 items-center w-lg">
            <Separator className="flex-1" />
            <span className="text-sm text-nowrap"> Or </span>
            <Separator className="flex-1" />
          </div>
          <p className="text-center">Let others include you in a workspace.</p>
        </div>
      )}
    </div>
  );
}
