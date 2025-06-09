import { asyncHandler } from "@/utils/async-handler";
import { NotFoundException } from "@/utils/app-error";
import { Member } from "@/models/member";
import { User } from "@/models/user";
import { Workspace } from "@/models/workspace";
import { STATUS } from "@/utils/constants";
import {
  canAddMember,
  canChangeMemberRole,
  canRemoveMember,
  canViewMember,
} from "@/policies/member";
import mongoose from "mongoose";

export async function getMembers(c) {
  const { include = [], filters = [], sort, fields, size, page } = c?.query;

  const relationships = {
    user: [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    workspace: [
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace",
          foreignField: "_id",
          as: "workspace",
        },
      },
      {
        $unwind: {
          path: "$workspace",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  };

  const pipeline = [
    // Stage 1: filters
    ...filters,

    // Stage 2: Lookup members collection to verify user has membership in the same workspace
    {
      $lookup: {
        from: "members",
        let: { workspaceId: "$workspace" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$workspace", "$$workspaceId"] },
                  { $eq: ["$user", new mongoose.Types.ObjectId(c.user.id)] },
                ],
              },
            },
          },
        ],
        as: "memberships",
      },
    },

    // Stage 3: Only allow if viewer is a member of that workspace
    {
      $match: {
        memberships: { $ne: [] },
      },
    },

    // Stage 4:
    // stage 4: add relationships
    ...include?.flatMap(
      (item) =>
        Array.isArray(relationships[item])
          ? relationships[item] // If it's an array, spread it
          : [relationships[item]], // If it's a single stage, wrap in array
    ),

    // Stage 5: clean up memberships in result
    {
      $project: {
        memberships: 0,
      },
    },
  ];

  const members = await Member.aggregate(pipeline);
  const totalRecords = await Member.countDocuments([
    ...pipeline,
    { $count: "count" },
  ]).then((result) => result[0]?.count || 0);

  return c.json.success({
    data: {
      members,
      totalRecords,
      totalPages: page && Math.ceil(totalRecords / size),
      page,
      size,
    },
  });
}

export async function getMember(c) {
  const memberId = c.req.param("memberId");
  const member = await Member.findById(memberId);
  if (!member) throw new NotFoundException("Member not found");

  await canViewMember(c.user, member);

  return c.json.success({ data: { member } });
}

export const createMember = asyncHandler(async function (c) {
  const { user: userId, workspace: workspaceId, role } = await c.req.json();

  const user = await User.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new NotFoundException("Workspace not found");

  await canAddMember(c.user, workspace);

  const member = new Member({
    user: userId,
    workspace: workspaceId,
    role,
  });

  await member.save();

  return c.json.success({ statusCode: STATUS.HTTP.CREATED, data: workspace });
});

export const updateMember = asyncHandler(async function (c) {
  const memberId = c.req.param("memberId");
  const member = await Member.findById(memberId);
  if (!member) throw new NotFoundException("Member not found");
  const { role } = await c.req.json();

  await canChangeMemberRole(c.user, member, role);

  const updatedMember = await Member.findByIdAndUpdate(member.id, { role });
  await member.save();

  return c.json.success({
    data: { member: updatedMember },
  });
});

export const deleteMember = asyncHandler(async function (c) {
  const memberId = c.req.param("memberId");
  const member = await Member.findById(memberId);
  if (!member) throw new NotFoundException("Member not found");

  await canRemoveMember(c.user, member);

  await Member.findByIdAndDelete(member.id);

  return c.json.success({ data: {} });
});
