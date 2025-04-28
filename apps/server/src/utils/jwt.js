import { sign, verify } from "hono/jwt"
import { config } from "@/configs/app";

// TODO: change role and additional details 
const signToken = async (userId) => await sign(
  {
    sub: userId,
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 60 * 5
  },
  config.AUTH_SECRET
);

const verifyToken = async (token) => await verify(token, config.AUTH_SECRET);

export { signToken, verifyToken }
