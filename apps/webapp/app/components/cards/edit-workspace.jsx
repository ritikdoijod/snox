import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
import AvatarInput from "@/components/features/avatar-input";

const schema = z.object({
  name: z
    .string()
    .nonempty("Workspace name is required")
    .trim()
    .min(1)
    .max(255),
  description: z.string().trim().max(255).optional(),
  avatar: z.any(),
});

export function EditWorkspaceCard() {
  const fetcher = useFetcher();
  const { workspace } = useLoaderData();

  const form = useForm({
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
      ...(workspace.avatar
        ? { avatar: `http://localhost:3000/x/${workspace.avatar}` }
        : null),
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const { formState } = form;

  const { isDirty, isValid } = formState;

  async function onSubmit() {
    let data = {};
    Object.keys(formState.dirtyFields).map((x) => {
      data[x] = form.getValues(x);
    });

    let avatar = data.avatar;

    if (avatar) {
      const response = await fetch(data.avatar);
      if (!response.ok) throw new Error("Failed to upload image");
      const blob = await response.blob();

      avatar = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    fetcher.submit(
      { ...data, avatar, workspaceId: workspace.id },
      {
        method: "patch",
        action: "/workspaces",
        encType: "application/json",
      }
    );
  }

  useEffect(() => {
    if (!fetcher?.data) return;

    if (fetcher.data.error) toast(fetcher.data.error?.message);
  }, [fetcher.data]);

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <CardTitle>Edit workspace</CardTitle>
        <CardDescription>
          Here you can update the details of your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={fetcher.state === "submitting"}>
              <div className="grid gap-6">
                <div className="flex justify-center items-center">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AvatarInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Workspace 1"
                          className="h-12"
                          {...field}
                        />
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
                        Workspace description
                        <span className="text-muted-foreground text-xs font-light italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          {...field}
                          className="min-h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  {fetcher.state === "submitting" ? (
                    <Button disabled>
                      <Loader2 className="animate-spin" />
                      Updating workspace...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={!isDirty || !isValid}
                    >
                      Update Workspace
                    </Button>
                  )}
                </div>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
