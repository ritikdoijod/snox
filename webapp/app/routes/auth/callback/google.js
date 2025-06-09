import { redirect } from "react-router";

import { asyncHandler } from "@/lib/async-handler";
import { commitSession, getSession } from "@/sessions";
import { fc } from "@/configs/fc";

export const loader = asyncHandler(async function ({ request }) {
  const code = new URL(request.url).searchParams.get("code");

  const { token, user } = await fc.get(`/auth/callback/google?code=${code}`);

  const session = await getSession(request.headers.get("Cookie"));
  session.set("uid", user.id);
  session.set("token", token);

  return redirect("/workspaces", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
});
