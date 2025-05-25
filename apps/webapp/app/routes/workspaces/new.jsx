import { useEffect } from "react";
import { useFetcher, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Plus, Loader2, Info, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AvatarInput from "@/components/features/avatar-input";

export const loader = auth(function () {
  return {};
});

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

export default function CreateWorkspace() {
  const fetcher = useFetcher();

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

  async function onSubmit(data) {
    const response = await fetch(data.avatar);
    if (!response.ok) throw new Error("Failed to upload image");
    const blob = await response.blob();

    const base64Image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    fetcher.submit(
      { ...data, avatar: base64Image },
      {
        method: "post",
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
    <div className="w-4xl mx-auto">
      <Card className="p-0 grid grid-cols-2 gap-0 overflow-hidden">
        <div className="py-12 flex flex-col gap-9">
          <CardHeader className="text-center">
            <CardTitle>Create new workspace</CardTitle>
            <CardDescription>
              Set up your new workspace to organize your tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset disabled={fetcher.state === "submitting"}>
                  <div className="grid gap-8">
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
                    <div className="flex justify-between gap-4">
                      <Button type="button" variant="secondary">
                        <ArrowLeft />
                        Go back
                      </Button>
                      {fetcher.Formstate === "submitting" ? (
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
                          <Plus />
                          Create workspace
                        </Button>
                      )}
                    </div>
                  </div>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </div>
        <div className="relative hidden bg-muted md:block">
          <img
            src="/assets/images/workspace.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full dark:grayscale dark:brightness-[0.25]"
          />
          <div className="absolute right-4 bottom-4">
            <Link
              to="https://storyset.com/people"
              className="text-xs text-muted-foreground font-light italic flex items-center gap-2"
            >
              People illustrations by Storyset
              <span>
                <Info className="size-3" />
              </span>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
