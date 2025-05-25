import { Outlet, Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function AuthLayout() {
  return (
    <main className="h-full flex flex-col justify-center items-center">
      <Outlet />

      <div className="mt-8 self-center max-w-xs text-balance text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Button variant="link" className="p-0 text-xs h-fit" asChild>
          <Link to="/terms">Terms of Service</Link>
        </Button>{" "}
        and{" "}
        <Button variant="link" className="p-0 text-xs h-fit" asChild>
          <Link tp="/privacy">Privacy Policy</Link>
        </Button>
      </div>
    </main>
  );
}
