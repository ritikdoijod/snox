import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function AppSidebar() {
  return (
    <Card className="h-fit min-h-9/12 w-3xs">
      <CardHeader className="px-4">
        <WorkspaceSwitcher />
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <NavMain />
        <NavProjects />
      </CardContent>
      <CardFooter>
        <NavUser />
      </CardFooter>
    </Card>
  );
}
