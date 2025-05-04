import { redirect } from "react-router";
import { getSession } from "@/sessions";
import { asyncHandler } from "./async-handler";

export function auth(fn) {
  return asyncHandler(async function ({ request, ...args }) {
    const session = await getSession(request.headers.get("Cookie"));
    const uid = session.get("uid");
    if (!uid) return redirect("/");
    if (!!fn) return fn({ request, ...args, session });
    return null;
  });
}
