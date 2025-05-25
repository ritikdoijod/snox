import { Link, Outlet } from "react-router";

import { ModeToggle } from "@/components/mode-toggle";

export default function Loyout() {
  return (
    <div className="px-8 h-screen flex flex-col">
      <nav className="py-3 px-6 rounded-b-lg border border-border flex items-center justify-between bg-card">
        <Link to="/">
          <h1 className="text-xl font-bold italic">snox</h1>
        </Link>
        <ModeToggle />
      </nav>
      <div className="flex-1 my-6">
        <Outlet />
      </div>
    </div>
  );
}
