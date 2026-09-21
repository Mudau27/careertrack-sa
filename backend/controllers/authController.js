const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const pool = require("../config/database");


// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        name = name?.trim();
        email = email?.trim().toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Name, email and password are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: "error",
                message: "Password must be at least 8 characters long."
            });
        }

        const existingUser = await pool.query(
            `SELECT id
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                status: "error",
                message: "A user with this email already exists."
            });
        }

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        const result = await pool.query(
            `INSERT INTO users (
                name,
                email,
                password_hash
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                name,
                email,
                role,
                created_at`,
            [
                name,
                email,
                passwordHash
            ]
        );

        return res.status(201).json({
            status: "success",
            message: "User registered successfully.",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message: "Server error during registration."
        });
    }
};


// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email?.trim().toLowerCase();

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required."
            });
        }

        const result = await pool.query(
            `SELECT *
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password."
            });
        }

        const user = result.rows[0];

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!passwordMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.json({
            status: "success",
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message: "Server error during login."
        });
    }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;

        email = email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                status: "error",
                message: "Email address is required."
            });
        }

        const result = await pool.query(
            `SELECT id, email
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email]
        );

        /*
         * Do not reveal whether an account exists.
         */
        if (result.rows.length === 0) {
            return res.json({
                status: "success",
                message:
                    "If an account exists for that email, password reset instructions will be sent."
            });
        }

        const user = result.rows[0];

        /*
         * Generate secure random reset token.
         */
        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        /*
         * Store only SHA-256 hash in database.
         */
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        /*
         * Token expires after 15 minutes.
         */
        const resetExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await pool.query(
            `UPDATE users
             SET
                password_reset_token = $1,
                password_reset_expires = $2
             WHERE id = $3`,
            [
                resetTokenHash,
                resetExpires,
                user.id
            ]
        );

        /*
         * DEVELOPMENT ONLY
         *
         * We return the token temporarily so the
         * reset-password flow can be tested locally.
         *
         * Before production this will be removed and
         * the reset link will be emailed instead.
         */
        return res.json({
            status: "success",
            message:
                "If an account exists for that email, password reset instructions will be sent.",
            development: {
                resetToken
            }
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message:
                "Server error while processing password reset request."
        });
    }
};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                status: "error",
                message:
                    "Password reset token is required."
            });
        }

        if (!password) {
            return res.status(400).json({
                status: "error",
                message:
                    "New password is required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: "error",
                message:
                    "Password must be at least 8 characters long."
            });
        }

        /*
         * Hash incoming token so it can be compared
         * with the hash stored in PostgreSQL.
         */
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const result = await pool.query(
            `SELECT id
             FROM users
             WHERE password_reset_token = $1
             AND password_reset_expires > NOW()`,
            [resetTokenHash]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                status: "error",
                message:
                    "This password reset link is invalid or has expired."
            });
        }

        const user = result.rows[0];

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );

        /*
         * Change password AND invalidate reset token.
         */
        await pool.query(
            `UPDATE users
             SET
                password_hash = $1,
                password_reset_token = NULL,
                password_reset_expires = NULL
             WHERE id = $2`,
            [
                passwordHash,
                user.id
            ]
        );

        return res.json({
            status: "success",
            message:
                "Your password has been reset successfully. You can now sign in with your new password."
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message:
                "Server error while resetting password."
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
};