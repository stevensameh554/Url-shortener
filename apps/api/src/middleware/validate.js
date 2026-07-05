export function validate(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!parsed.success) {
      return next({
        status: 400,
        message: parsed.error.issues.map((issue) => issue.message).join(", ")
      });
    }

    req.validated = parsed.data;
    next();
  };
}
