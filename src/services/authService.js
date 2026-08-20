const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const pool = require("../config/database");

/* ───────────────────────── Helpers ───────────────────────── */

const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

/* ───────────────────────── JWT ───────────────────────── */

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            mobile: user.mobile
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};

/* ───────────────────────── REGISTER ───────────────────────── */

const register = async (email, mobile, password) => {

    // At least email or mobile is required
    if (!email && !mobile) {
        const error = new Error(
            "At least one of email or mobile number must be provided"
        );

        error.statusCode = 400;
        throw error;
    }

    // Check existing email
    if (email) {
        const [emailRows] = await pool.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (emailRows.length > 0) {
            const error = new Error("Email already registered");
            error.statusCode = 409;
            throw error;
        }
    }

    // Check existing mobile
    if (mobile) {
        const [mobileRows] = await pool.query(
            "SELECT id FROM users WHERE mobile = ? LIMIT 1",
            [mobile]
        );

        if (mobileRows.length > 0) {
            const error = new Error("Mobile number already registered");
            error.statusCode = 409;
            throw error;
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [result] = await pool.query(
        `
        INSERT INTO users
        (email, mobile, password)
        VALUES (?, ?, ?)
        `,
        [email || null, mobile || null, hashedPassword]
    );

    // Get newly created user
    const [rows] = await pool.query(
        `
        SELECT
            id,
            email,
            mobile,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [result.insertId]
    );

    const user = rows[0];

    // Generate JWT
    const token = generateToken(user);

    return {
        user,
        token
    };
};

/* ───────────────────────── LOGIN ───────────────────────── */

const login = async (emailOrMobile, password) => {

    const field = isEmail(emailOrMobile) ? "email" : "mobile";

    const [rows] = await pool.query(
        `
        SELECT
            id,
            email,
            mobile,
            password,
            created_at,
            updated_at
        FROM users
        WHERE ${field} = ?
        LIMIT 1
        `,
        [emailOrMobile]
    );

    if (rows.length === 0) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user);

    const userResponse = {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    };

    return {
        user: userResponse,
        token
    };
};

module.exports = {
    register,
    login
};