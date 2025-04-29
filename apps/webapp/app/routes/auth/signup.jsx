import { redirect } from "react-router";
import { api } from "@/configs/fc";
import { getSession } from "@/sessions";
import { SignUpCard } from "@/components/cards/sign-up";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const uid = session.get("uid");
  if (uid) return redirect("/");
  return null;
}

export async function action({ request }) {
  const formData = await request.formData();
  const { name, email, password } = Object.fromEntries(formData);

  await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return redirect("/auth/login");
}

export default function SignUp() {
  return <SignUpCard />
}
