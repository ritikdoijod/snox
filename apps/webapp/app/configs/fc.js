import { AppError } from "@/lib/errors";
import { create } from "@/lib/fc";

export const fc = create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-type": "application/json",
  },
});

fc.hooks.req.use(async (opts) => {
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

fc.hooks.res.use(async (res) => {
  if (res.status === "success") return res.data;
  throw new AppError(
    res.error.message,
    res.error?.details?.reduce((acc, current) => {
      acc[current.field] = current.message;
      return acc;
    }, {})
  );
});
