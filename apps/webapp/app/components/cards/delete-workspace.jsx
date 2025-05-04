import { useNavigation, Form } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2, ShieldAlert } from "lucide-react";

export function DeleteWorkspaceCard({ workspace }) {
  const navigation = useNavigation();

  const schema = z.object({
    name: z
      .string()
      .nonempty("Workspace name is required")
      .trim()
      .min(1)
      .max(255)
      .refine((val) => val === workspace.name, {
        message: "Workspace name does not match",
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

  return (
    <Card className="w-full border-none bg-destructive/[1%]">
      <CardHeader>
        <CardTitle className="text-xl text-destructive flex items-center gap-2 mb-4">
          <ShieldAlert />
          Danger zone
        </CardTitle>
        <CardTitle className="text-xl">Delete workspace</CardTitle>
        <CardDescription className="mt-2">
          Deleting a workspace will permanently remove all its tasks, with no
          option to recover them. Please be certain before proceeding.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-8">
        <FormProvider {...form}>
          <Form action={`/workspaces/${workspace.id}/delete`} method="post">
            <fieldset disabled={navigation.state === "submitting"}>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input className="h-12 bg-background" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter workspace name{" "}
                        <span className="text-foreground">{workspace.name}</span>{" "}to confirm deletion.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {navigation.state === "submitting" ? (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Deleting workspace...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-destructive/80 hover:bg-destructive/80 cursor-pointer"
                    disabled={!isDirty || !isValid}
                  >
                    Delete Workspace
                  </Button>
                )}
              </div>
            </fieldset>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
