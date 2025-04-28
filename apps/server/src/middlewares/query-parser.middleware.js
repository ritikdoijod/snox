const parseFilters = (req, res, next) => {
  const { filters, page, size } = req.query;

  if (page) req.query.page = parseInt(page);

  if (size) req.query.size = parseInt(size);

  if (filters) {
    req.query.filters = JSON.parse(
      JSON.stringify(req.query.filters).replace(
        /\b(eq|gte|gt|in|lte|lt|ne|nin|and|not|nor|or|exists|type|expr|jsonSchema|mod|regex|text|where|all|elemMatch|size)\b/g,
        (op) => `$${op}`
      )
    );
  }

  next();
};

export { parseFilters };
