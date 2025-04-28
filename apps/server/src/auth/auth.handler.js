import mongoose from "mongoose";
import { User } from "@/users/users.model";
import { Workspace } from "@/workspaces/workspaces.model";
import { UnauthorizedException, BadRequestException } from "@/utils/app-error";
import { signToken } from "@/utils/jwt";

const login = async (c) => {
  const { email, password } = await c.req.json();

  // check if user exist
  const user = await User.findOne({ email });

  if (!user) throw new UnauthorizedException("Invalid Credentials");


  if (await user.verifyPassword(password)) {
    const token = await signToken(user._id);

    return c.json.success({ data: { token, user } });
  }

  throw new UnauthorizedException("Invalid Credentials");
};


const registerUser = async (c) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { name, email, password } = await c.req.json();

    // check if user already exist with email
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new BadRequestException("Email already exist");

    const newUser = new User({
      name,
      email,
      password,
    });

    const workspace = new Workspace({
      name: "My Workspace",
      description: "Default workspace created for user",
      author: newUser?._id,
    });

    workspace.save({ session });

    newUser.currentWorkspace = workspace?._id;
    newUser.workspaces = [workspace?._id];

    await newUser.save({ session });
    await session.commitTransaction();

    return c.json.success({
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export { login, registerUser };
