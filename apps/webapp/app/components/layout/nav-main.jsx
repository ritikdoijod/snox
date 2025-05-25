import { Link, useLoaderData, useMatch } from "react-router";
import { ClipboardList, Pentagon, Settings2, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

const items = [
  {
    title: "Home",
    icon: Pentagon,
    url: "",
  },
  {
    title: "My Tasks",
    icon: ClipboardList,
    url: "/tasks",
  },
  {
    title: "Settings",
    icon: Settings2,
    url: "/settings",
  },
  {
    title: "Members",
    icon: UsersRound,
    url: "/members",
  },
];

const NavMain = () => {
  const { workspace: activeWorkspace } = useLoaderData();

  return (
    <div className="space-y-2">
      <div className="px-2 text-xs font-medium text-muted-foreground">
        Main menu
      </div>
      <div className="px-2 flex flex-col items-start">
        {items?.map((item, index) => {
          const path = `/workspaces/${activeWorkspace?.id}${item.url}`;
          const match = useMatch(path);

          return (
            <Button
              key={index}
              variant="link"
              className={`text-xs p-0 has-[>svg]:p-0 h-9 ${
                match ? "text-primary font-semibold underline" : "text-muted-foreground"
              }`}
              asChild
            >
              <Link to={path}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export { NavMain };
