import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";

export const action = auth(async function ({ request, session }) {
  let actionData = {};
  switch (request.method) {
    case "POST":
      const { user, workspace, permissions } = await request.json();
      await api.post(
        "/members",
        {
          user,
          workspace,
          permissions,
        },
        {
          session,
        }
      );
      break;
    default:
      throw new Error("Method not allowed");
  }
  return actionData;
});
