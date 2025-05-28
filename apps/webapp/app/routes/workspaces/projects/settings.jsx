import { auth } from "@/lib/auth";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableOfContents } from "@/components/ui/toc";

import { EditProjectCard } from "@/components/cards/edit-project";
import { DeleteProjectCard } from "@/components/cards/delete-project";

export const loader = auth(async function ({ params: { projectId }, fc }) {
  const { project } = await fc.get(`/projects/${projectId}`);

  return { project };
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

export default function ProjectSettings({ loaderData: { workspace, events } }) {
  return (
    <div className="flex flex-1" id="settings">
      <div className="px-6 flex-1">
        <ScrollArea className="h-[calc(100vh-7rem)]">
          <div className="space-y-6 mb-[85%]">
            <EditProjectCard id="edit" />
            <DeleteProjectCard id="delete" />
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
