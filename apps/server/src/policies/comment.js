import { Permissions } from "@/enums/role";
import { Comment } from "@/models/comment";
import { Member } from "@/models/member";
import { authz } from "@/utils/auth";
import { RolePermissions } from "@/utils/role-permission";

export const canCreateComment = authz(async function (user, task) {
  const pipeline = [
    // Stage 1: Lookup the project to get the workspace
    {
      $lookup: {
        from: "projects",
        let: { projectId: task.project },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$projectId"],
              },
            },
          },
        ],
        as: "project",
      },
    },

    // Stage 2: Unwind project to access workspace
    {
      $unwind: "$project",
    },

    // Stage 3: Lookup memberships to verify user is a member of the workspace
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$workspace", "$project.workspace"] },
            { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] },
          ],
        },
      },
    },

    // Stage 4:
    {
      $limit: 1,
    },
  ];

  const [member] = await Member.aggregate(pipeline);

  return (
    !!member && RolePermissions[member.role].includes(Permissions.EDIT_TASK)
  );
});

export const canEditComment = authz(async function (user, comment) {
  if (user.id !== comment.createdBy.toString()) return false;

  const lastComment = await Comment.findOne({ task: comment.task }).sort({
    createdAt: -1,
  });

  return comment.id === lastComment.id;
});

export const canDeleteComment = authz(async function (user, comment) {
  if (user.id !== comment.createdBy.toString()) return false;

  const lastComment = await Comment.findOne({ task: comment.task }).sort({
    createdAt: -1,
  });

  return comment.id === lastComment.id;
});
