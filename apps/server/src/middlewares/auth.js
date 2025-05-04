import {
  UnauthorizedException,
  InternalServerException,
  NotFoundException,
} from "@/utils/app-error";
import { verifyToken } from "@/utils/jwt";
import { User } from "@/models/user";

const authn = async (c, next) => {
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
    throw new InternalServerException("Internal Server Error");
  }
};

export { authn };
