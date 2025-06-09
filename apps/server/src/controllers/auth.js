import { config } from "@/configs/app";
import { User } from "@/models/user";
import { UnauthorizedException, BadRequestException } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";
import { signToken } from "@/utils/jwt";
import QueryString from "qs";
import { decode } from "hono/jwt";

export const login = asyncHandler(async function (c) {
  const { email, password } = await c.req.json();

  const user = await User.findOne({ email });

  if (!user) throw new UnauthorizedException("Invalid Credentials");

  if (await user.verifyPassword(password)) {
    const token = await signToken(user.id);

    return c.json.success({ data: { token, user } });
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

export const googleOAuthCallback = asyncHandler(async function (c) {
  const res = await fetch(
    `https://oauth2.googleapis.com/token?${QueryString.stringify({
      code: c.req.query("code"),
      client_id: config.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: config.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: config.GOOGLE_OAUTH_REDIRECT_URI,
      grant_type: "authorization_code",
    })}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { id_token } = await res.json();

  const {
    payload: { email, name, picture },
  } = decode(id_token);

  const user = await User.findOneAndUpdate(
    { email },
    { name, email, avatar: picture },
    { upsert: true, new: true }
  );

  const token = await signToken(user.id);

  return c.json.success({
    data: {
      user,
      token,
    },
  });
});
