import { auth } from "@/lib/auth";

export const action = auth(async function ({ request, fc }) {
  let actionData = {};

  switch (request.method) {
    case "POST": {
      const { content, task } = await request.json();

      await fc.post("/comments", {
        content,
        task,
      });
      break;
    }

    case "PATCH": {
      const { content, commentId } = await request.json();
      await fc.patch(`/comments/${commentId}`, {
        content,
      });
      break;
    }

    case "DELETE": {
      const { commentId } = await request.json();
      await fc.delete(`/comments/${commentId}`);
      break;
    }

    default: {
      actionData = { error: { message: "Method not allowed" } };
      break;
    }
  }

  return actionData;
});
