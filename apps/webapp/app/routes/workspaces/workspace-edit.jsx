import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";
import { redirect } from "react-router";

export const action = auth(async function ({
  request,
  params: { workspaceId },
  session,
}) {
  const formData = await request.formData();
  const { name, description } = Object.fromEntries(formData);
  await api.patch(
    `/workspaces/${workspaceId}`,
    { name, description },
    { session }
  );

  return redirect(`/workspaces/${workspaceId}/settings`)
});
