import { Outlet } from "react-router";
import QueryString from "qs";
import { auth } from "@/lib/auth";

export const loader = auth(async function ({ params: { projectId }, fc }) {
  const { project } = await fc.get(
    `/projects/${projectId}?${QueryString.stringify({
      include: ["createdBy"],
    })}`
  );
  const { tasks } = await fc.get(
    `/tasks?${QueryString.stringify({
      filters: [
        {
          $match: {
            project: projectId,
          },
        },
      ],
      include: ["createdBy"],
    })}`
  );

  return {
    project,
    tasks: tasks.map((task) => ({
      ...task,
      assignee: {
        id: "user1",
        name: "User 1",
        profilePic: "https://github.com/shadcn.png",
        email: "user@mail.com",
      },
    })),
  };
});

export default function ({ loaderData: { project, tasks } }) {
  return <Outlet context={{ project, tasks }} />;
}
