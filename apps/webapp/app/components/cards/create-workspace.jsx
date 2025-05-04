import { useNavigation, useNavigate, Form } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

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

const schema = z.object({
  name: z
    .string()
    .nonempty("Workspace name is required")
    .trim()
    .min(1)
    .max(255),
  description: z.string().trim().max(255).optional(),
});

export function CreateWorkspaceCard() {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  return (
    <Card className="w-full md:w-sm border-none">
      <CardHeader>
        <CardTitle className="text-xl">Create new workspace</CardTitle>
        <CardDescription className="mt-2">
          Set up your new workspace to organize your tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <FormProvider {...form}>
          <Form action="/workspaces/new" method="post">
            <fieldset disabled={navigation.state === "submitting"}>
              <div className="grid gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
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
                        Workspace description
                        <span className="text-muted-foreground text-xs font-light italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-24" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {navigation.state === "submitting" ? (
                  <Button disabled className="cursor-pointer">
                    <Loader2 className="animate-spin" />
                    Creating workspace...
                  </Button>
                ) : (
                  <div className="flex gap-8 justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => navigate(-1)}
                    >
                      Go back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isDirty || !isValid}
                      className="cursor-pointer"
                    >
                      Create Workspace
                    </Button>
                  </div>
                )}
              </div>
            </fieldset>
          </Form>
        </FormProvider>
      </CardContent>
    </Card >
  );
}
