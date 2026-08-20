const authService = require("../services/authService");
const ApiResponse = require("../utils/apiResponse");

/* ───────────────────────── REGISTER ───────────────────────── */

const register = async (req, res, next) => {
  try {

    const {
      email,
      mobile,
      password
    } = req.body;

    const { user, token } =
      await authService.register(
        email,
        mobile,
        password
      );

    return ApiResponse.success(res, {
      statusCode: 201,
      message: "Registration successful",
      data: {
        user,
        token
      }
    });

  } catch (error) {

    if (error.statusCode) {
      return ApiResponse.error(res, {
        statusCode: error.statusCode,
        message: error.message
      });
    }

    next(error);
  }
};

/* ───────────────────────── LOGIN ───────────────────────── */

const login = async (req, res, next) => {
  try {

    const {
      emailOrMobile,
      password
    } = req.body;

    const { user, token } =
      await authService.login(
        emailOrMobile,
        password
      );

    return ApiResponse.success(res, {
      statusCode: 200,
      message: "Login successful",
      data: {
        user,
        token
      }
    });

  } catch (error) {

    if (error.statusCode) {
      return ApiResponse.error(res, {
        statusCode: error.statusCode,
        message: error.message
      });
    }

    next(error);
  }
};

module.exports = {
  register,
  login
};