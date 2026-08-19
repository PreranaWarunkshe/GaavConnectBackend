const authService = require("../services/authService");
const ApiResponse = require("../utils/apiResponse");

const login = async (req, res, next) => {
  try {
    const { emailOrMobile, password } = req.body;

    const { user, token } = await authService.login(emailOrMobile, password);

    return ApiResponse.success(res, {
      statusCode: 200,
      message: "Login successful",
      data: { user, token },
    });
  } catch (error) {
   y
    if (error.statusCode) {
      return ApiResponse.error(res, {
        statusCode: error.statusCode,
        message: error.message,
      });
    }
   
    next(error);
  }
};

module.exports = { login };
