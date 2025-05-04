import { sign, verify } from "hono/jwt";
import { config } from "@/configs/app";

// TODO: change role and additional details
const signToken = async (userId) =>
  await sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    config.AUTH_SECRET
  );

const verifyToken = async (token) => await verify(token, config.AUTH_SECRET);

export { signToken, verifyToken };
