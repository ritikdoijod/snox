import { User } from "@/models/user";
import { UnauthorizedException, BadRequestException } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";
import { signToken } from "@/utils/jwt";

export const login = asyncHandler(async function (c) {
  const { email, password } = await c.req.json();

  const user = await User.findOne({ email });

  if (!user) throw new UnauthorizedException("Invalid Credentials");

  if (await user.verifyPassword(password)) {
    const token = await signToken(user.id);

    return c.json.success({ data: { token } });
  }

  throw new UnauthorizedException("Invalid Credentials");
});

export const registerUser = asyncHandler(async function (c) {
  const { name, email, password } = await c.req.json();

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new BadRequestException("Email already exist");

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const token = await signToken(newUser.id);

  return c.json.success({
    data: {
      user: newUser,
      token,
    },
  });
});
