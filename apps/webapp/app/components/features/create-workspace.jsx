import { Fragment, useEffect, useState } from "react";
import { useNavigate, useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowRightIcon, Plus, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
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

export function CreateWorkspaceDialog({ children }) {
  const [step, setStep] = useState(1);
  const fetcher = useFetcher();

  function onSubmit(data) {
    fetcher.submit(data, {
      method: "post",
      action: "/workspaces",
      encType: "application/json",
    });
  }

  useEffect(() => {
    if (fetcher?.data?.workspace) setStep(2);

    if (fetcher?.data?.error) toast(fetcher?.data?.error?.message);
  }, [fetcher?.data]);

  // Step mapping
  const steps = {
    1: <StepOne onSubmit={onSubmit} state={fetcher.state} />,
    2: <StepTwo workspaceId={fetcher?.data?.workspace?.id} />,
  };

  return (
    <Dialog onOpenChange={() => setStep(1)}>
      {children}
      {steps[step]}
    </Dialog>
  );
}

/***************************************************************
 *                       Step Components
 ***************************************************************/

// Step 1 Component
function StepOne({ onSubmit, state }) {
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create new workspace</DialogTitle>
        <DialogDescription>
          Set up your new workspace to organize your tasks.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={state === "submitting"}>
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

              <DialogFooter className="sm:justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                {state === "submitting" ? (
                  <Button disabled className="cursor-pointer">
                    <Loader2 className="animate-spin" />
                    Creating workspace...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    className="cursor-pointer"
                  >
                    Create workspace
                  </Button>
                )}
              </DialogFooter>
            </div>
          </fieldset>
        </form>
      </Form>
    </DialogContent>
  );
}

// Step 2 Component
function StepTwo({ workspaceId }) {
  const navigate = useNavigate();

  return (
    <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
      <DialogHeader className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-accent rounded-full p-6 mb-4">
          <Check className="size-6" />
        </div>
        <DialogTitle className="text-center text-lg font-semibold">
          Workspace created
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-muted-foreground">
          Your workspace has been created successfully. You can now start using
          your new workspace.
        </DialogDescription>
      </DialogHeader>

      <DialogClose asChild>
        <Button
          onClick={() => {
            navigate(`/workspaces/${workspaceId}`);
          }}
          className="w-fit"
        >
          Go to workspace
          <ArrowRightIcon className="size-4" />
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
