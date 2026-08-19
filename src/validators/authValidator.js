const { body, validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

/* ───────────────────────── helpers ───────────────────────── */

/**
 * Returns true if the value is a valid email address.
 */
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/**
 * Returns true if the value is a valid 10-digit Indian mobile number
 * (starts with 6-9).
 */
const isMobile = (value) => /^[6-9]\d{9}$/.test(value);

/**
 * Middleware that checks for validation errors produced by express-validator
 * and returns a formatted 422 response if any exist.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return ApiResponse.error(res, {
      statusCode: 422,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  next();
};

/* ───────────────────── validation rules ─────────────────── */

/**
 * Validation chain for POST /api/auth/login
 */
const loginValidator = [
  body("emailOrMobile")
    .trim()
    .notEmpty()
    .withMessage("Email or mobile number is required")
    .custom((value) => {
      if (!isEmail(value) && !isMobile(value)) {
        throw new Error(
          "Please provide a valid email address or a 10-digit mobile number"
        );
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  handleValidationErrors,
];

module.exports = {
  loginValidator,
};
