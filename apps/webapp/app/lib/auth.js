import { redirect } from "react-router";
import { getSession } from "@/sessions";
import { asyncHandler } from "./async-handler";
import {fc} from "@/configs/fc"

export function auth(fn) {
  return asyncHandler(async function ({ request, ...args }) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has("uid")) return redirect("/");
    if (!!fn) {
      fc.session(session);
      return fn({ request, ...args, session, fc });
    }
    return null;
  });
}
