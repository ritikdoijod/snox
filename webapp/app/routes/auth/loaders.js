import { redirect } from "react-router";

import { asyncHandler } from "@/lib/async-handler";
import { getSession } from "@/sessions";

export const loader = asyncHandler(async function ({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const uid = session.get("uid");
  if (uid) return redirect("/");
  return null;
});
