import { Link } from "react-router";
import { ClipboardList, Pentagon, Settings2, UsersRound } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAppSidebar } from "./app-sidebar.jsx";

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
  }
];

const NavMain = () => {
  const { activeWorkspace } = useAppSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">
        {items?.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link to={`/workspaces/${activeWorkspace?.id + item.url}`}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export { NavMain };
