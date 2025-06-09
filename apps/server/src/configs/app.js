import { env } from "@/utils/env.js";

const appConfig = () => {
  return {
    PORT: env("PORT", 8000),
    AUTH_SECRET: env("AUTH_SECRET"),
    MONGO_URI: env("MONGO_URI"),
    STATIC_FILE_SERVER_URL: env("STATIC_FILE_SERVER_URL"),
    GOOGLE_OAUTH_CLIENT_ID: env("GOOGLE_OAUTH_CLIENT_ID"),
    GOOGLE_OAUTH_CLIENT_SECRET: env("GOOGLE_OAUTH_CLIENT_SECRET"),
    GOOGLE_OAUTH_REDIRECT_URI: env("GOOGLE_OAUTH_REDIRECT_URI"),
  };
};

const config = appConfig();

export { config };
