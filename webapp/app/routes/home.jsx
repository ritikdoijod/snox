import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/contexts/auth";
import { RiGithubLine } from "react-icons/ri";
import { ModeToggle } from "@/components/mode-toggle";

const FEATURES = [
  {
    title: "Organize Workspaces",
    description:
      "Create and manage multiple workspaces for different projects or teams.",
    icon: "🗂️",
  },
  {
    title: "Collaborate Easily",
    description: "Invite team members and collaborate in real-time.",
    icon: "🤝",
  },
  {
    title: "Track Tasks",
    description: "Assign, track, and complete tasks efficiently.",
    icon: "✅",
  },
  {
    title: "Minimal UI",
    description:
      "Stay focused on your tasks with a clean and simple interface.",
    icon: "🎨",
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="h-full px-8 flex flex-col">
      {/* Hero Section */}
      <Card className="rounded-t-none py-16 relative">
        <div className="absolute right-6 top-6">
          <ModeToggle />
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">
            Welcome to <span className="text-primary">Snox</span>
          </CardTitle>
          <CardDescription className="mt-4 text-base">
            The modern way to organize your workspaces, collaborate with your
            team, and get things done.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col items-center">
          {user ? (
            <Button asChild className="mb-2">
              <Link to="/workspaces">Go to your Workspaces</Link>
            </Button>
          ) : (
            <div className="flex gap-4 mb-2">
              <Button asChild size="sm">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/auth/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Section */}
      <section className="pt-12 w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">Why Snox?</h2>
        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <div className="">{feature.icon}</div>

                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-18">
        <Button asChild>
          <Link
            to="https://github.com/ritikdoijod/snox"
          >
            <RiGithubLine />
            View Source Code
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-auto py-12 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Snox. Built for modern workspaces.
      </footer>
    </main>
  );
}
