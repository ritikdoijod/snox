import { redirect } from "react-router";
import { getSession, destroySession } from "@/sessions";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
