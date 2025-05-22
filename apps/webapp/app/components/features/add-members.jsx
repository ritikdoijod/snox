import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { AddMemberCard } from "@/components/cards/add-member";
import { useLoaderData } from "react-router";

export function AddMembersCard() {
  const { users } = useLoaderData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input className="peer pe-9" placeholder="Search user..." />
          <Button
            variant="ghost"
            className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
          >
            <Search size={16} aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-12 space-y-3">
          {users.map((user) => (
            <AddMemberCard user={user} key={user.id} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
