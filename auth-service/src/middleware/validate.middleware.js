const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Zod v4 uses err.issues; v3 uses err.errors — support both
      const issues = err.issues ?? err.errors;
      const message = issues.map((e) => e.message).join(", ");
      return res.status(400).json({ success: false, message });
    }
    // Non-validation errors should propagate to the error handler
    next(err);
  }
};

module.exports = validate;
