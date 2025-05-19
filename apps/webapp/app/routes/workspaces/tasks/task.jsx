import { auth } from "@/lib/auth";

export const loader = auth(async function ({ params: { taskId }, fc }) {
  const {task} = await fc.get(`/tasks/${taskId}`);

  return { task };
});

export default function Task({ params: { taskId }, loaderData: {task} }) {
  return <div>{task.title}</div>;
}
