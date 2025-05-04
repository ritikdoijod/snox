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
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z
    .string()
    .nonempty("Workspace name is required")
    .trim()
    .min(1)
    .max(255),
  description: z.string().trim().max(255).optional(),
});

export function EditWorkspaceCard({ workspace }) {
  const navigation = useNavigation();

  const form = useForm({
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <CardTitle className="text-xl">Edit workspace</CardTitle>
        <CardDescription className="mt-2">
          Here you can update the details of your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <FormProvider {...form}>
          <Form action={`/workspaces/${workspace.id}/edit`} method="post">
            <fieldset disabled={navigation.state === "submitting"}>
              <div className="grid gap-6">
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

                {navigation.state === "submitting" ? (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Updating workspace...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    // disabled={!isDirty || !isValid}
                  >
                    Update Workspace
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
