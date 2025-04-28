import { redirect } from "react-router";
import { api } from "@/configs/fc";
import { commitSession, getSession } from "@/sessions";
import { SignInCard } from "@/components/cards/sign-in";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const uid = session.get("uid");
  if (uid) return redirect("/");
  return null;
}

export async function action({ request }) {
  const { email, password } = await request.json();

  const { token, user } = await api.post("/auth/login", {
    email,
    password,
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("uid", user._id);
  session.set("token", token);

  return redirect(`/`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function SignIn() {
  return <SignInCard />;
}
