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
      include: ["createdBy", "assignee"],
    })}`
  );

  return {
    project,
    tasks,
  };
});

export default function ({ loaderData: { project, tasks } }) {
  return <Outlet context={{ project, tasks }} />;
}
