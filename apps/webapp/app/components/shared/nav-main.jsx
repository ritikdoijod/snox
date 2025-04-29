import { Link } from "react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAppSidebar } from "./app-sidebar.jsx";

const NavMain = () => {
  const { navMain: items } = useAppSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-3">
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link to={item.url}>
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
