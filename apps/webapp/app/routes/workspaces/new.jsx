import { redirect } from "react-router";
import { toast } from "sonner";
import { api } from "@/configs/fc";
import { CreateWorkspaceCard } from "@/components/cards/create-workspace";
import { ModeToggle } from "@/components/mode-toggle";
import { auth } from "@/lib/auth";

export const loader = auth();

export const action = auth(async function ({ request, session }) {
  const formData = await request.formData();
  const { name, description } = Object.fromEntries(formData);

  const workspace = await api.post(
    "/workspaces",
    {
      name,
      description,
    },
    { session }
  );

  return redirect(`/workspaces/${workspace.id}`);
});

export default function CreateWorkspace() {

  return (
    <main className="h-screen">
      <div className="h-full md:flex md:flex-col md:justify-center mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <img src="/logo.svg" className="w-[80px]" />

          <ModeToggle />
        </nav>
        <div className="md:flex-1 flex flex-col justify-center items-center">
          <CreateWorkspaceCard />
        </div>
      </div>
    </main>
  );
}
