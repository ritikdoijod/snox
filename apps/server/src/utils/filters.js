/**
 * @param {Object} filters - Filters object
 * @returns {object}
 */

const parseFilters = (filters) => {
  return JSON.parse(
    JSON.stringify(filters).replace(
      /\b(eq|gte|gt|in|lte|lt|ne|nin|and|not|nor|or|exists|type|expr|jsonSchema|mod|regex|text|where|all|elemMatch|size)\b/g,
      (op) => `$${op}`,
    ),
  );
};

export { parseFilters };
