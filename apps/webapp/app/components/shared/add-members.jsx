import { useNavigation, Form } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { AddMemberCard } from "@/components/cards/add-member";

const schema = z.object({
  input: z.string().trim().min(1).max(255),
});

export function AddMember({ users }) {
  const navigation = useNavigation();

  const form = useForm({
    defaultValues: {
      input: "",
    },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  return (
    <div className="mt-8">
      <FormProvider {...form}>
        <Form action="/members/new" method="post">
          <fieldset disabled={navigation.state === "submitting"}>
            <div className="grid gap-8">
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search user</FormLabel>
                    <FormControl>
                      <div className="mt-1 relative">
                        <Input
                          className="peer pe-9"
                          placeholder="Enter name or email"
                        />
                        <Button
                          variant="ghost"
                          className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
                        >
                          <Search size={16} aria-hidden="true" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
        </Form>
      </FormProvider>

      <div className="mt-12 space-y-3">
        {users.map((user) => (
          <AddMemberCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
