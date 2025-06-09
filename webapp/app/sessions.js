import { createCookieSessionStorage } from "react-router";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "session",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60,
      secrets: ["s3cr3t"], // TODO: set env for secret
    },
  });

export { getSession, commitSession, destroySession };
