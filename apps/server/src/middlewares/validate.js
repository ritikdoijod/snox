import { AppError, ERROR_CODES } from "@/utils/app-error";

export function validate({ param, query, body }) {
  return async function (c, next) {
    const errors = [];

    function parse(schema, data, path) {
      const parsed = schema.safeParse(data);
      if (!parsed.success) errors.push({ path, errors: parsed.error.issues.map(issue => ({...issue, path: issue.path.join(".")})) });
    }

    if (param) parse(param, c.req.param(), "params");
    if (query) parse(query, c.query, "query");
    if (body) parse(body, await c.req.json(), "body");

    if (errors.length > 0) {
      throw new AppError(
        400,
        ERROR_CODES.VALIDATION_ERROR,
        "Request validation failed",
        errors
      );
    }

    await next();
  };
}
