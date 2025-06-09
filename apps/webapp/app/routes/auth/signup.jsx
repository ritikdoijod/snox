import { useEffect } from "react";
import { toast } from "sonner";
import { Link, useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { getGoogleAuthURL } from "@/utils/google";

export { loader } from "./loaders";
export { signup as action } from "./actions";

export default function SignUp({ actionData: { error } = {} }) {
  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  return <SignUpCard />;
}

const schema = z.object({
  name: z.string().nonempty("Name is required").trim().min(1).max(255),
  email: z
    .string()
    .nonempty("Email is required")
    .trim()
    .email("Invalid email address")
    .min(1)
    .max(255),
  password: z.string().nonempty("Password is required").trim().min(6).max(255),
});

function SignUpCard() {
  const fetcher = useFetcher();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  function onSubmit(data) {
    fetcher.submit(data, {
      method: "post",
      action: "/auth/signup",
      encType: "application/json",
    });
  }

  return (
    <Card className="w-full md:w-sm border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription className="mt-2">
          Sign up with your Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid">
          <Button variant="outline" className="cursor-pointer" asChild>
            <Link to={getGoogleAuthURL()}>
              <FcGoogle />
              <span className="ml-4">Sign up with Google</span>
            </Link>
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <Separator className="flex-1" />
          <span className="text-sm text-nowrap"> Or continue with </span>
          <Separator className="flex-1" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={fetcher.state === "submitting"}>
              <div className="grid gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Jash e."
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@mail.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fetcher.state === "submitting" ? (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Signing up...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={!isDirty || !isValid}
                  >
                    Sign up
                  </Button>
                )}
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?&nbsp;
        <Button variant="link" asChild className="p-0 text-sm cursor-pointer">
          <Link to="/auth/login">Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
