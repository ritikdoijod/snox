import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { projectLoader } from "./loaders";
import { Badge } from "@/components/ui/badge";

export const loader = projectLoader;

export default function ({ loaderData: { project } }) {
  return (
    <div className="flex h-full">
      <div className="flex-1 p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{project.name}</h2>
            {/* <p className="text-muted-foreground">See your team members here.</p> */}
          </div>
          <div className="mt-1 relative">
            <Input className="peer pe-9" placeholder="Search task..." />
            <Button
              variant="ghost"
              className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
            >
              <Search size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-lg bg-accent/10">
        <div className="p-8">
          <h2 className="text-lg font-medium">Summary</h2>
        </div>
        <div>
          <Badge>Total</Badge>
          <Badge>Pending</Badge>
          <Badge>Complete</Badge>
          <Badge>Overdue</Badge>
          <Badge>In Progress</Badge>
          <Badge>On Hold</Badge>
          <Badge>Cancelled</Badge>
          <Badge>Not Started</Badge>
          <Badge>Waiting</Badge>
          <Badge>In Review</Badge>
        </div>
      </div>
    </div>
  );
}
