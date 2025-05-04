import { useFetcher, useParams, useNavigation } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  permissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

const items = [
  {
    title: "Workspace",
    items: [
      {
        id: "CREATE_WORKSPACE",
        label: "Create",
      },
      {
        id: "EDIT_WORKSPACE",
        label: "Edit",
      },
      {
        id: "DELETE_WORKSPACE",
        label: "Delete",
      },
    ],
  },
  {
    title: "Member",
    items: [
      {
        id: "CREATE_MEMBER",
        label: "Create",
      },
      {
        id: "DELETE_MEMBER",
        label: "Delete",
      },
      {
        id: "EDIT_MEMBER_PERMISSIONS",
        label: "Edit Permissions",
      },
    ],
  },
  {
    title: "Project",
    items: [
      {
        id: "CREATE_PROJECT",
        label: "Create",
      },
      {
        id: "EDIT_PROJECT",
        label: "Edit",
      },
      {
        id: "DELETE_PROJECT",
        label: "Delete",
      },
    ],
  },
  {
    title: "Task",
    items: [
      {
        id: "CREATE_TASK",
        label: "Create",
      },
      {
        id: "EDIT_TASK",
        label: "Edit",
      },
      {
        id: "DELETE_TASK",
        label: "Delete",
      },
    ],
  },
];

export function AddMemberCard({ user }) {
  const fetcher = useFetcher();
  const { workspaceId } = useParams();
  const navigation = useNavigation();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      permissions: ["read"],
    },
  });

  async function onSubmit() {
    fetcher.submit(
      {
        user: user.id,
        workspace: workspaceId,
        permissions: ["VIEW_ONLY"],
      },
      {
        action: "/members",
        method: "post",
        encType: "application/json",
      }
    );
  }

  return (
    <Card key={user.id} className="p-4">
      <CardHeader className="flex p-0 justify-between">
        <div className="flex gap-2">
          <Avatar className="size-9">
            <AvatarImage alt={user.name} />
            <AvatarFallback className="text-xs">
              {user.name
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <CardTitle className="text-sm">{user.name}</CardTitle>
            <CardDescription className="text-xs">{user.email}</CardDescription>
          </div>
        </div>
        <Button
          size="sm"
          className="text-xs h-7 cursor-pointer"
          onClick={onSubmit}
        >
          Add
        </Button>
      </CardHeader>
    </Card>
  );
}
