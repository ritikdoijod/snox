import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";
import { redirect } from "react-router";

export const action = auth(async function ({
  params: { workspaceId },
  session,
}) {
  await api.delete(`/workspaces/${workspaceId}`, { session });

  return redirect("/workspaces");
});
