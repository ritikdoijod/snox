import { authz } from "@/utils/auth";

export const canEditComment = authz(async function (user, comment) {
  if (user.id !== comment.createdBy) return false;

  const lastComment = await Comment.findOne({ task: comment.task }).sort({
    createdAt: -1,
  });

  return comment.id === lastComment.id;
});
