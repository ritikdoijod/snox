import { asyncHandler } from "@/utils/async-handler";
import { User } from "@/models/user";
import { NotFoundException } from "@/utils/app-error";
import { uploadFile } from "@/utils/file-upload";

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

export const updateUser = asyncHandler(async function (c) {
  const { avatar, name, email, bio, password } = await c.req.json();

  const user = await User.findByIdAndUpdate(
    c.user.id,
    {
      ...(avatar ? { avatar: await uploadFile(avatar) } : { avatar }),
      name,
      email,
      bio,
      password,
    },
    {
      returnDocument: "after",
    }
  );

  return c.json.success({ data: { user } });
});
