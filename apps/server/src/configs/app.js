import { env } from "@/utils/env.js";

const appConfig = () => {
  return {
    PORT: env("PORT", 8000),
    AUTH_SECRET: env("AUTH_SECRET"),
    MONGO_URI: env("MONGO_URI"),
  };
};

const config = appConfig();

export { config };
