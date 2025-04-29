import { User } from "./users.model";
import { NotFoundException } from "@/utils/app-error";

const getUser = async (c) => {
  const { userId } = c.req.param();

  const user = await User.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  return c.json.success({ data: { user } });
};

export { getUser }
