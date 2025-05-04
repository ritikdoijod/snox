import QueryString from "qs";

import { DeleteWorkspaceCard } from "@/components/cards/delete-workspace";
import { EditWorkspaceCard } from "@/components/cards/edit-workspace";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkspaceTimeline } from "@/components/shared/workspace-timeline";

import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";
import { useEffect } from "react";
import { toast } from "sonner";

export const loader = auth(async function ({
  params: { workspaceId },
  session,
}) {
  const { workspace } = await api.get(`/workspaces/${workspaceId}`, {
    session,
  });

  const { events } = await api.get(
    `/events?${QueryString.stringify({
      filters: {
        workspace: workspaceId,
      },
      include: "createdBy",
      sort: "-createdAt",
    })}`,
    {
      session,
    }
  );

  return { workspace, events };
});

export default function WorkspaceSettings({
  loaderData: { workspace, events },
}) {
  return (
    <div className="h-screen flex justify-between">
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
      <div className="w-xl bg-accent/10">
        <div className="p-8">
          <h2 className="text-lg font-medium">Activity</h2>
          <WorkspaceTimeline events={events} />
        </div>
      </div>
    </div>
  );
}
