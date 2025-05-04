import mongoose from "mongoose";
import { User } from "@/models/user";
import { Workspace } from "@/models/workspace";
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
  try {
    const { name, email, password } = await c.req.json();

    // check if user already exist with email
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new BadRequestException("Email already exist");

    const newUser = await User.create({
      name,
      email,
      password,
    });

    return c.json.success({
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    throw error;
  }
};

export { login, registerUser };
