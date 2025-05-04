import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, useNavigate, useNavigation } from "react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormProvider,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().nonempty("Project name is required").trim().min(1).max(255),
  description: z.string().trim().max(255).optional(),
});

export function CreateProjectDialog() {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full size-5">
          <Plus className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Projects help you organise tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <FormProvider {...form}>
            <Form action="/workspaces/new" method="post">
              <fieldset disabled={navigation.state === "submitting"}>
                <div className="grid gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Project name</FormLabel>
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
                          Project description
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
                      Creating project...
                    </Button>
                  ) : (
                    <div className="flex gap-8 justify-between">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={!isDirty || !isValid}
                        className="cursor-pointer"
                      >
                        Create project
                      </Button>
                    </div>
                  )}
                </div>
              </fieldset>
            </Form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
