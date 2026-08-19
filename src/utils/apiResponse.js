/**
 * Standardised API response helpers.
 *
 * Every response follows the shape:
 * {
 *   success: Boolean,
 *   message: String,
 *   data:    Object | null,
 *   errors:  Array  | null
 * }
 */

class ApiResponse {
  static success(res, { statusCode = 200, message = "Success", data = null }) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      errors: null,
    });
  }

  static error(
    res,
    { statusCode = 500, message = "Internal Server Error", errors = null }
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      errors,
    });
  }
}

module.exports = ApiResponse;
