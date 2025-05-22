import QueryString from "qs";

import { DeleteWorkspaceCard } from "@/components/cards/delete-workspace";
import { EditWorkspaceCard } from "@/components/cards/edit-workspace";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkspaceTimeline } from "@/components/layout/workspace-timeline";

import { auth } from "@/lib/auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
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
    <div className="flex flex-1">
      <div className="px-8 space-y-3 flex-1">
        <Breadcrumb className="py-3">
          <BreadcrumbList>
            <BreadcrumbItem className="text-primary font-medium">
              Settings
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ScrollArea className="flex-1">
          <div className="space-y-6">
            <EditWorkspaceCard workspace={workspace} />
            <DeleteWorkspaceCard workspace={workspace} />
          </div>
        </ScrollArea>
      </div>
      <Card className="w-2xs">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        {/* <WorkspaceTimeline events={events} /> */}
      </Card>
    </div>
  );
}
