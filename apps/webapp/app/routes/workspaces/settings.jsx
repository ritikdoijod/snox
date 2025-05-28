import QueryString from "qs";
import { auth } from "@/lib/auth";

import { DeleteWorkspaceCard } from "@/components/cards/delete-workspace";
import { EditWorkspaceCard } from "@/components/cards/edit-workspace";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Card, CardContent } from "@/components/ui/card";
import { TableOfContents } from "@/components/ui/toc";

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

const toc = {
  items: [
    {
      title: "Settings",
      url: "#settings",
      items: [
        {
          title: "Edit",
          url: "#edit",
        },
        {
          title: "Delete",
          url: "#delete",
        },
      ],
    },
  ],
};

export default function WorkspaceSettings({}) {
  return (
    <div className="flex flex-1" id="settings">
      <div className="px-6 flex-1">
        <ScrollArea className="h-[calc(100vh-7rem)]">
          <div className="space-y-6 mb-[85%]">
            <EditWorkspaceCard id="edit" />
            <DeleteWorkspaceCard id="delete" />
          </div>
        </ScrollArea>
      </div>
      <Card className="w-2xs">
        <CardContent>
          <TableOfContents toc={toc} />
        </CardContent>
      </Card>
    </div>
  );
}
