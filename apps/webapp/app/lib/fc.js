import { AppError } from "./errors";

const create = (config) => {
  const reqHooks = [];
  const resHooks = [];

  const fc = async (path, options = {}) => {
    const url = `${config?.baseURL}${path}`;
    const headers = {
      ...config.headers,
      ...(options.headers || {}),
    };

    let opts = { ...config, ...options, ...headers, url };

    for (const hook of reqHooks) opts = await hook(opts);

    try {
      const res = await fetch(url, {
        method: opts.method || "GET",
        headers: opts.headers,
        ...(options.body ? { body: JSON.stringify(options.body) } : null),
      });

      let data = await res.json();

      for (const hook of resHooks) data = await hook(data);

      return data;
    } catch (error) {
      throw new AppError(error.message, error.details);
    }
  };

  return {
    get: (path, options) => fc(path, { ...options, method: "GET" }),
    post: (path, body, options) =>
      fc(path, { ...options, method: "POST", body }),
    patch: (path, body, options) =>
      fc(path, { ...options, method: "PATCH", body }),
    delete: (path, options) => fc(path, { ...options, method: "DELETE" }),
    hooks: {
      req: { use: (fn) => reqHooks.push(fn) },
      res: { use: (fn) => resHooks.push(fn) },
    },
  };
};

export { create };