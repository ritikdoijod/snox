import { asyncHandler } from "@/utils/async-handler";
import { User } from "@/models/user";
import { NotFoundException } from "@/utils/app-error";

export const getUsers = asyncHandler(async function (c) {
  const users = await User.find();

  return c.json.success({ data: { users } });
});

export const getUser = async (c) => {
  const { userId } = c.req.param();

  const user = await User.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  return c.json.success({ data: { user } });
};
