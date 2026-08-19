const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User");

/* ───────────────────────── helpers ───────────────────────── */

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/**
 * Generate a signed JWT for the given user.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, mobile: user.mobile },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/* ─────────────────────── login ──────────────────────────── */

/**
 * Authenticate a user by email-or-mobile and password.
 *
 * @param {string} emailOrMobile - Email address or 10-digit mobile number.
 * @param {string} password      - Plain-text password.
 * @returns {{ user: object, token: string }}
 * @throws {Object} { statusCode, message }
 */
const login = async (emailOrMobile, password) => {
  // Build a dynamic where clause depending on input type
  const whereClause = isEmail(emailOrMobile)
    ? { email: emailOrMobile }
    : { mobile: emailOrMobile };

  // 1. Check if user exists
  const user = await User.findOne({ where: whereClause });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // 3. Generate JWT
  const token = generateToken(user);

  // Strip password from the returned user object
  const userResponse = {
    id: user.id,
    email: user.email,
    mobile: user.mobile,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { user: userResponse, token };
};

module.exports = { login };
