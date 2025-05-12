import { useEffect, useState } from "react";
import { useNavigate, useFetcher, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowRightIcon, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  name: z.string().nonempty("Project name is required").trim().min(1).max(255),
  description: z.string().trim().max(255).optional(),
});

export function CreateProjectDialog({ children }) {
  const { workspaceId } = useParams();
  const [step, setStep] = useState(1);
  const fetcher = useFetcher();

  function onSubmit(data) {
    fetcher.submit({
      ...data,
      workspace: workspaceId,
    }, {
      method: "post",
      action: "/projects",
      encType: "application/json",
    });
  }

  useEffect(() => {
    if (fetcher?.data?.project) setStep(2);

    if (fetcher?.data?.error) toast(fetcher?.data?.error?.message);
  }, [fetcher?.data]);

  // Step mapping
  const steps = {
    1: <StepOne onSubmit={onSubmit} state={fetcher.state} />,
    2: <StepTwo project={fetcher?.data?.project} />,
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
        <DialogTitle>Create project</DialogTitle>
        <DialogDescription>Projects help you organise tasks.</DialogDescription>
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

              <DialogFooter className="sm:justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                {state === "submitting" ? (
                  <Button disabled className="cursor-pointer">
                    <Loader2 className="animate-spin" />
                    Creating project...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    className="cursor-pointer"
                  >
                    Create project
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
function StepTwo({ project }) {
  const navigate = useNavigate();

  return (
    <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
      <DialogHeader className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-accent rounded-full p-6 mb-4">
          <Check className="size-6" />
        </div>
        <DialogTitle className="text-center text-lg font-semibold">
          Project created
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-muted-foreground">
          Your project has been created successfully. You can now start creating
          new tasks your new project.
        </DialogDescription>
      </DialogHeader>

      <DialogClose asChild>
        <Button
          onClick={() => {
            navigate(`/workspaces/${project.workspace}/projects/${project.id}`);
          }}
          className="w-fit"
        >
          Go to project
          <ArrowRightIcon className="size-4" />
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
