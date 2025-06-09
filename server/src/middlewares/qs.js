import QueryString from "qs";
import mongoose from "mongoose";

export function parseQueryString(c, next) {
  c.query = QueryString.parse(c.req.query());
  c.query.filters = parseFilters(c.query.filters);
  c.query.search = parseSearch(c.query.search);
  return next();
}

function parseFilters(filters) {
  if (!filters) return;

  if (Array.isArray(filters))
    return filters.map((filter) => parseFilters(filter));

  if (typeof filters === "object") {
    const newObject = {};
    for (const [key, value] of Object.entries(filters)) {
      if (mongoose.isValidObjectId(value))
        newObject[key] = new mongoose.Types.ObjectId(value);
      else {
        newObject[key] = parseFilters(value);
      }
    }
    return newObject;
  }

  return filters;
}

function parseSearch(search) {
  if (!search) return;

  // Escape special characters in the search string
  return search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
