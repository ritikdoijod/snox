import { useEffect } from "react";
import { toast } from "sonner";
import { SignUpCard } from "@/components/cards/sign-up";

export { loader } from "./loaders";
export { signup as action } from "./actions";

export default function SignUp({ actionData: { error } = {} }) {
  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  return <SignUpCard />;
}
