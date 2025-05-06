import { AppError } from "@/lib/errors";
import { create } from "@/lib/fc";

const api = create({
  // TODO: set env for backend URL
  baseURL: "http://localhost:8000",
  headers: {
    "Content-type": "application/json",
  },
});

api.hooks.req.use(async (opts) => {
  if (!opts.url.includes("auth")) {
    const token = opts?.session?.get("token");

    if (token)
      opts.headers = {
        ...opts.headers,
        authorization: `Bearer ${token}`,
      };
  }

  return opts;
});

api.hooks.res.use(async (res) => {
  if (res.status === "success") return res.data;
  throw new AppError(
    res.error.message,
    res.error?.details?.reduce((acc, current) => {
      acc[current.field] = current.message;
      return acc;
    }, {})
  );
});

export { api };
