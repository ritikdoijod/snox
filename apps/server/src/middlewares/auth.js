import {
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
  JwtTokenNotBefore,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";

import { NotFoundException, UnauthorizedException } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";
import { verifyToken } from "@/utils/jwt";

import { User } from "@/models/user";

export const authn = asyncHandler(async (c, next) => {
  try {
    const authorization = c.req.header("authorization");
    if (!authorization) throw new UnauthorizedException("Unauthorized");

    if (authorization.startsWith("Bearer")) {
      const token = authorization.split(" ")[1];

      const decoded = await verifyToken(token);
      const userId = decoded.sub;
      const user = await User.findById(userId);
      if (!user) throw new NotFoundException("User not found");
      c.user = user;
      return next();
    }

    throw new UnauthorizedException("Unauthorized");
  } catch (error) {
    if (
      error instanceof JwtTokenExpired ||
      error instanceof JwtTokenInvalid ||
      error instanceof JwtTokenNotBefore ||
      error instanceof JwtTokenIssuedAt ||
      error instanceof JwtTokenSignatureMismatched
    )
      throw new UnauthorizedException("Unauthorized");

    throw error;
  }
});
