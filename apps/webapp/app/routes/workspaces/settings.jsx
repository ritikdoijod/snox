import { useEffect } from "react";
import { useFetcher, useLoaderData, useNavigation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/auth";

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
import { getBase64Image } from "@/utils/image";

import { useAuth } from "@/lib/contexts/auth";

export const loader = auth(async function ({ params: { workspaceId }, fc }) {
  const { workspace } = await fc.get(`/workspaces/${workspaceId}`);

  return { workspace };
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

export default function WorkspaceSettings() {
  return (
    <div className="flex flex-1" id="settings">
      <div className="px-6 flex-1">
        <ScrollArea className="h-[calc(100vh-7rem)]">
          <div className="space-y-6 mb-[85%]">
            <EditWorkspaceCard id="edit" />
            <DeleteWorkspaceCard id="delete" />
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
  name: z
    .string()
    .nonempty("Workspace name is required")
    .trim()
    .min(1)
    .max(255),
  description: z.string().trim().max(255).optional(),
  avatar: z.any(),
});

export function EditWorkspaceCard(props) {
  const fetcher = useFetcher();
  const { workspace } = useLoaderData();

  const form = useForm({
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
      avatar: workspace.avatar,
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
        workspaceId: workspace.id,
      },
      {
        method: "patch",
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
    <Card {...props}>
      <CardHeader>
        <CardTitle>Edit workspace</CardTitle>
        <CardDescription>
          Here you can update the details of your workspace.
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
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input placeholder="Workspace 1" {...field} />
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

                <div className="flex justify-end">
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

export function DeleteWorkspaceCard(props) {
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const { user } = useAuth();
  const { workspace } = useLoaderData();

  if (user.id !== workspace.createdBy) return null;

  function onSubmit() {
    fetcher.submit(
      {
        workspaceId: workspace.id,
      },
      {
        action: "/workspaces",
        method: "delete",
        encType: "application/json",
      }
    );
  }

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
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2 mb-4">
          <ShieldAlert className="size-5" />
          Danger zone
        </CardTitle>
        <CardTitle>Delete workspace</CardTitle>
        <CardDescription>
          Deleting a workspace will permanently remove all its tasks, with no
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
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter workspace name{" "}
                        <span className="text-foreground">
                          {workspace.name}
                        </span>{" "}
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
                      Deleting workspace...
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
