import { useEffect } from "react";
import { useNavigation, useFetcher, useLoaderData } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldAlert } from "lucide-react";

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
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { useAuth } from "@/lib/contexts/auth";

export function DeleteProjectCard(props) {
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const { user } = useAuth();
  const { project } = useLoaderData();

  if (user.id !== project.createdBy) return null;

  function onSubmit() {
    fetcher.submit(
      {
        projectId: project.id,
      },
      {
        action: `/workspaces/${project.workspace}/projects`,
        method: "delete",
        encType: "application/json",
      }
    );
  }

  const schema = z.object({
    name: z
      .string()
      .nonempty("Project name is required")
      .trim()
      .min(1)
      .max(255)
      .refine((val) => val === project.name, {
        message: "Project name does not match",
      }),
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  useEffect(() => {
    if (!fetcher?.data) return;

    if (fetcher.data.error) toast(fetcher.data.error?.message);
  }, [fetcher.data]);

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2 mb-4">
          <ShieldAlert className="size-5" />
          Danger zone
        </CardTitle>
        <CardTitle>Delete project</CardTitle>
        <CardDescription>
          Deleting a project will permanently remove all its tasks, with no
          option to recover them. Please be certain before proceeding.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-8">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={navigation.state === "submitting"}>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter project name{" "}
                        <span className="text-foreground">{project.name}</span>{" "}
                        to confirm deletion.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  {navigation.state === "submitting" ? (
                    <Button disabled>
                      <Loader2 className="animate-spin" />
                      Deleting...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-destructive/80 hover:bg-destructive/80 cursor-pointer"
                      disabled={!isDirty || !isValid}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </fieldset>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
