import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { getBase64Image } from "@/utils/image";
import { useAuth } from "@/lib/contexts/auth";

import { AvatarInput } from "@/components/avatar-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const loader = auth(function () {
  return {};
});

export const action = auth(async function ({ request, fc }) {
  const { name, email, avatar, bio } = await request.json();
  await fc.patch("/users", {
    name,
    email,
    avatar,
    bio,
  });
});

const schema = z.object({
  name: z.string().nonempty("Name is required").trim().min(1).max(255),
  email: z.string().trim().max(255).optional(),
  bio: z.string().trim().max(255).optional(),
  avatar: z.any(),
});

export default function UserProfile() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm({
    defaultValues: {
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      bio: user.bio,
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  async function onSubmit(data) {
    fetcher.submit(
      {
        ...data,
        ...(!!data.avatar
          ? { avatar: await getBase64Image(data.avatar) }
          : null),
      },
      {
        method: "patch",
        action: "/profile",
        encType: "application/json",
      }
    );
  }

  useEffect(() => {
    if (!fetcher?.data) return;

    if (fetcher.data.error) toast(fetcher.data.error?.message);
  }, [fetcher.data]);

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="pt-0 w-md overflow-hidden">
        <CardHeader className="pt-6 pb-9 bg-primary text-primary-foreground">
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={fetcher.state === "submitting"}>
                <div className="flex justify-end -mt-15">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AvatarInput
                            {...field}
                            className="bg-card rounded-full size-20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Bio
                          <span className="text-muted-foreground text-xs font-light italic">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} className="min-h-24 max-h-40" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <ArrowLeft />
                      Go back
                    </Button>
                    {fetcher.Formstate === "submitting" ? (
                      <Button disabled className="cursor-pointer">
                        <Loader2 className="animate-spin" />
                        Updating profile...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!isDirty || !isValid}
                        className="cursor-pointer"
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
