import { useEffect } from "react";
import { useNavigation, useFetcher, useLoaderData } from "react-router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/auth";
import { getBase64Image } from "@/utils/image";
import { useAuth } from "@/lib/contexts/auth";

import { AvatarInput } from "@/components/avatar-input";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableOfContents } from "@/components/ui/toc";
import { Textarea } from "@/components/ui/textarea";


export const loader = auth(async function ({ params: { projectId }, fc }) {
  const { project } = await fc.get(`/projects/${projectId}`);

  return { project };
});

const toc = {
  items: [
    {
      title: "Settings",
      url: "#settings",
      items: [
        {
          title: "Edit",
          url: "#edit",
        },
        {
          title: "Delete",
          url: "#delete",
        },
      ],
    },
  ],
};

export default function ProjectSettings({}) {
  return (
    <div className="flex flex-1" id="settings">
      <div className="px-6 flex-1">
        <ScrollArea className="h-[calc(100vh-7rem)]">
          <div className="space-y-6 mb-[85%]">
            <EditProjectCard id="edit" />
            <DeleteProjectCard id="delete" />
          </div>
        </ScrollArea>
      </div>
      <Card className="w-2xs">
        <CardContent>
          <TableOfContents toc={toc} />
        </CardContent>
      </Card>
    </div>
  );
}

const schema = z.object({
  name: z.string().nonempty("Project name is required").trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
  avatar: z.any(),
});

export function EditProjectCard(props) {
  const fetcher = useFetcher();
  const { project } = useLoaderData();

  const form = useForm({
    defaultValues: {
      name: project.name,
      description: project.description,
      avatar: project.avatar,
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid, dirtyFields },
  } = form;

  async function onSubmit() {
    let data = {};
    Object.keys(dirtyFields).map((x) => {
      data[x] = form.getValues(x);
    });

    let avatar = data.avatar;

    fetcher.submit(
      {
        ...data,
        ...(avatar ? { avatar: await getBase64Image(avatar) } : avatar),
        projectId: project.id,
      },
      {
        method: "patch",
        action: `/workspaces/${project.workspace}/projects`,
        encType: "application/json",
      }
    );
  }

  useEffect(() => {
    if (!fetcher?.data) return;

    if (fetcher.data.error) toast(fetcher.data.error?.message);
  }, [fetcher.data]);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Edit project</CardTitle>
        <CardDescription>
          Here you can update the details of project.
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
                        <Textarea {...field} className="min-h-32" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  {isDirty && (
                    <Button
                      type="button"
                      className="cursor-pointer"
                      variant="secondary"
                      onClick={() => form.reset()}
                    >
                      Cancel
                    </Button>
                  )}
                  {fetcher.state === "submitting" ? (
                    <Button disabled>
                      <Loader2 className="animate-spin" />
                      Updating...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={!isDirty || !isValid}
                    >
                      Update
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
        <Form {...form}>
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
        </Form>
      </CardContent>
    </Card>
  );
}
