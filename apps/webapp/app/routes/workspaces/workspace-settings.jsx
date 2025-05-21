import QueryString from "qs";

import { DeleteWorkspaceCard } from "@/components/cards/delete-workspace";
import { EditWorkspaceCard } from "@/components/cards/edit-workspace";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkspaceTimeline } from "@/components/layout/workspace-timeline";

import { auth } from "@/lib/auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const loader = auth(async function ({ params: { workspaceId }, fc }) {
  const { workspace } = await fc.get(`/workspaces/${workspaceId}`);

  const { events } = await fc.get(
    `/events?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
      include: "createdBy",
      sort: "-createdAt",
    })}`
  );

  return { workspace, events };
});

export default function WorkspaceSettings({
  loaderData: { workspace, events },
}) {
  return (
    <div className="flex-1 h-full flex justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/workspaces/${workspaceId}/projects/${projectId}`}>
                {projectId}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-primary font-medium">
            {task.title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ScrollArea className="h-full flex-1">
        <div className="py-8 px-16 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Workspace settings</h2>
            <p className="text-muted-foreground">
              Customize your workspace, update info, and control settings here.
            </p>
          </div>
          <EditWorkspaceCard workspace={workspace} />
          <DeleteWorkspaceCard workspace={workspace} />
        </div>
      </ScrollArea>
      <Card className="w-2xs">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        {/* <WorkspaceTimeline events={events} /> */}
      </Card>
    </div>
  );
}
