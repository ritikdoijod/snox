import { useEffect, useState } from "react";
import { useNavigate, useFetcher, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowRightIcon, Loader2, Check, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { PRIORITY, STATUS } from "@/utils/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Command, CommandDialog, CommandInput } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const schema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  status: z.enum(Object.values(STATUS.TASK)).optional(),
  priority: z.enum(Object.values(PRIORITY)).optional(),
});

export function CreateTaskDialog({ children }) {
  const { projectId } = useParams();
  const [step, setStep] = useState(1);
  const fetcher = useFetcher();

  function onSubmit(data) {
    fetcher.submit(
      {
        ...data,
        project: projectId,
      },
      {
        method: "post",
        action: "/tasks",
        encType: "application/json",
      }
    );
  }

  useEffect(() => {
    if (fetcher?.data?.task) setStep(2);

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
      status: STATUS.TASK.TODO,
      priority: PRIORITY.LOW,
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
        <DialogTitle>Create task</DialogTitle>
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
                    <FormLabel>Title</FormLabel>
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
                      Description
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
              <div className="grid grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-xs min-w-30">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-xs" value="LOW">
                            <span className="size-1.5 bg-cyan-500 rounded-full"></span>
                            Low
                          </SelectItem>
                          <SelectItem className="text-xs" value="MEDIUM">
                            {" "}
                            <span className="size-1.5 bg-amber-500 rounded-full"></span>
                            Medium
                          </SelectItem>
                          <SelectItem className="text-xs" value="HIGH">
                            {" "}
                            <span className="size-1.5 bg-red-500 rounded-full"></span>
                            High
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="sm:justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                {state === "submitting" ? (
                  <Button disabled className="cursor-pointer">
                    <Loader2 className="animate-spin" />
                    Creating task...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    className="cursor-pointer"
                  >
                    Create task
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
