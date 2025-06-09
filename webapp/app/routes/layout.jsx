import { Link, Outlet } from "react-router";

import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "@/components/layout/nav-user";

export default function Layout() {
  return (
    <div className="px-9 h-full max-h-screen overflow-hidden flex flex-col">
      <nav className="h-15 px-6 rounded-b-lg border border-border flex items-center justify-between bg-card shrink-0">
        <Link to="/">
          <h1 className="text-xl font-bold italic">snox</h1>
        </Link>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <NavUser />
        </div>
      </nav>
      <div className="flex-1 my-6">
        <Outlet />
      </div>
    </div>
  );
}
