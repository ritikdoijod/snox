import { Outlet, Link } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function AuthLayout() {
  return (
    <main className="h-screen">
      <div className="h-full md:flex md:flex-col md:justify-center mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <img src="/logo.svg" className="w-[80px]" />

          <ModeToggle />
        </nav>
        <div className="md:flex-1 flex flex-col justify-center items-center">
          <Outlet />

          <div className="mt-8 self-center max-w-xs text-balance text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Button variant="link" className="p-0 text-xs h-fit" asChild>
              <Link to="/terms">
                Terms of Service
              </Link>
            </Button>
            {" "}and{" "}
            <Button variant="link" className="p-0 text-xs h-fit" asChild>
              <Link tp="/privacy">
                Privacy Policy
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
