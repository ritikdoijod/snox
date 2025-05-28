import { useEffect } from "react";
import { useFetcher, Link, useParams } from "react-router";
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
import { getBase64Image } from "@/utils/image";

export const loader = auth(function () {
  return {};
});

const schema = z.object({
  name: z.string().nonempty("Project name is required").trim().min(1).max(255),
  description: z.string().trim().max(255).optional(),
  avatar: z.any(),
});

const items = [
  {
    id: 1,
    art: "/assets/images/kickoff.svg",
    title: "Project Kickoff",
  },
  {
    id: 2,
    art: "/assets/images/design.svg",
    title: "Design",
  },
  {
    id: 3,
    art: "/assets/images/development.svg",
    title: "Development",
  },
  {
    id: 4,
    art: "/assets/images/testing.svg",
    title: "Testing",
  },
  {
    id: 5,
    art: "/assets/images/launch.svg",
    title: "Launch",
  },
];

export default function CreateProject() {
  const { workspaceId } = useParams();
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
    fetcher.submit(
      {
        ...data,
        ...(!!data.avatar
          ? { avatar: await getBase64Image(data.avatar) }
          : null),
      },
      {
        method: "post",
        action: `/workspaces/${workspaceId}/projects`,
        encType: "application/json",
      }
    );
  }

  useEffect(() => {
    if (!fetcher?.data) return;

    if (fetcher.data.error) toast(fetcher.data.error?.message);
  }, [fetcher.data]);

  return (
    <div className="flex flex-1">
      <div className="px-6 space-y-3 flex-1">
        <Card className="p-0 overflow-hidden">
          <div className="py-6 flex flex-col gap-9">
            <CardHeader className="text-center">
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Start a new project to streamline your tasks, track progress,
                and collaborate seamlessly with your team.
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
                      <div className="flex justify-between gap-4">
                        <Button type="button" variant="secondary">
                          <ArrowLeft />
                          Go back
                        </Button>
                        {fetcher.Formstate === "submitting" ? (
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
                            <Plus />
                            Create project
                          </Button>
                        )}
                      </div>
                    </div>
                  </fieldset>
                </form>
              </Form>
            </CardContent>
          </div>
        </Card>
      </div>
      <Card className="w-2xs">
        <CardContent className="flex flex-col justify-between h-full">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-4">
              <img src={item.art} alt={item.title} className="w-28" />
              <p className="text-xs text-muted-foreground">{item.title}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
