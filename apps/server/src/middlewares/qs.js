import QueryString from "qs";

export function parseQueryString(c, next) {
  c.query = QueryString.parse(c.req.query());
  return next();
}
