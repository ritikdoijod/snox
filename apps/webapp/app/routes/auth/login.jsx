import { toast } from "sonner";

import { SignInCard } from "@/components/cards/sign-in";
import { useEffect } from "react";

export { loader } from "./loaders";
export { login as action } from "./actions";

export default function SignIn({ actionData: { error } = {} }) {
  useEffect(() => {
    if (!!error) toast.error(error.message);
  }, [error]);

  return <SignInCard />;
}
