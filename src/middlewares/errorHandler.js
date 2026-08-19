const ApiResponse = require("../utils/apiResponse");


const errorHandler = (err, req, res, _next) => {
  console.error("Unhandled Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal Server Error";

  return ApiResponse.error(res, { statusCode, message });
};

module.exports = errorHandler;
