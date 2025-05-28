import { env } from "@/utils/env.js";

const appConfig = () => {
  return {
    PORT: env("PORT", 8000),
    AUTH_SECRET: env("AUTH_SECRET"),
    MONGO_URI: env("MONGO_URI"),
    STATIC_FILE_SERVER_URL: env("STATIC_FILE_SERVER_URL"),
  };
};

const config = appConfig();

export { config };
