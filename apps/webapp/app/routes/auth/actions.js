import { redirect } from "react-router";

import { asyncHandler } from "@/lib/async-handler";
import { api } from "@/configs/fc";
import { commitSession, getSession } from "@/sessions";


export const login = asyncHandler(async function ({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  const { token, user } = await api.post("/auth/login", {
    email,
    password,
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("uid", user.id);
  session.set("token", token);

  return redirect("/workspaces", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
});


export const signup = asyncHandler(async function ({ request }) {
  const formData = await request.formData();
  const { name, email, password } = Object.fromEntries(formData);

  await api.post("/auth/register", {
    name,
    email,
    password,
  });

  const { token, user } = await api.post("/auth/login", {
    email,
    password,
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("uid", user.id);
  session.set("token", token);

  return redirect("/workspaces/new", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
});