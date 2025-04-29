import { Link, useNavigation, Form } from "react-router";
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
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .trim()
    .email("Invalid email address")
    .min(1)
    .max(255),
  password: z.string().nonempty("Password is required").trim().min(6).max(255),
});

export function SignInCard() {
  const navigation = useNavigation();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;



  return (
    <Card className="w-full md:w-sm border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription className="mt-2">Login with your Google account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid">
          <Button variant="outline" className="cursor-pointer">
            <FcGoogle />
            <span className="ml-4">
              Login with Google
            </span>
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <Separator className="flex-1" />
          <span className="text-sm text-nowrap"> Or continue with </span>
          <Separator className="flex-1" />
        </div>
        <FormProvider {...form}>
          <Form action="/auth/login" method="post">
            <fieldset disabled={navigation.state === "submitting"}>
              <div className="grid gap-8">
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

                {navigation.state === "submitting" ? (
                  <Button disabled className="cursor-pointer">
                    <Loader2 className="animate-spin" />
                    Logging in...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    className="cursor-pointer"
                  >
                    Login
                  </Button>
                )}
              </div>
            </fieldset>
          </Form>
        </FormProvider>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Don&apos;t have an account?&nbsp;
        <Button variant="link" asChild className="p-0 text-sm cursor-pointer">
          <Link to="/auth/signup">
            Sign up
          </Link>
        </Button>
      </CardFooter>
    </Card >
  );
}
