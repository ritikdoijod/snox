import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "../ui/button";

export function TaskCard({ title, description, status }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Collapsible className='group'>
          <CardDescription className="transition-all group-data-[state=closed]:line-clamp-2">
            {description}
          </CardDescription>
          <CollapsibleTrigger asChild>
            <Button
              size="icon"
              className="rounded-full data-[state=open]:rotate-180"
            >
              <ChevronDown />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardHeader>
      <CardContent>
        <Badge
          variant="outline"
          size="sm"
          className="text-xs px-3 bg-gray-100/10 py-1"
        >
          <span className="size-1.5 bg-gray-100 mr-1"></span>
          Not started
        </Badge>
      </CardContent>
    </Card>
  );
}
