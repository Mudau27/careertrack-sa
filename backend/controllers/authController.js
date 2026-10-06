const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const pool = require("../config/database");

const {
    sendPasswordResetEmail
} = require("../services/emailService");


// =====================================================
// PASSWORD VALIDATION
// =====================================================

const validatePassword = (password) => {

    if (!password || password.length < 8) {
        return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }

    return null;
};


// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {

    try {

        let {
            name,
            email,
            password
        } = req.body;


        // Clean input
        name = name?.trim();

        email = email
            ?.trim()
            .toLowerCase();


        // ---------------------------------------------
        // Required fields
        // ---------------------------------------------

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                status: "error",
                message:
                    "Name, email and password are required."
            });
        }


        // ---------------------------------------------
        // Password validation
        // ---------------------------------------------

        const passwordError =
            validatePassword(password);

        if (passwordError) {

            return res.status(400).json({
                status: "error",
                message: passwordError
            });
        }


        // ---------------------------------------------
        // Check whether email already exists
        // ---------------------------------------------

        const existingUser =
            await pool.query(
                `SELECT id
                 FROM users
                 WHERE LOWER(email) = LOWER($1)`,
                [email]
            );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                status: "error",
                message:
                    "A user with this email already exists."
            });
        }


        // ---------------------------------------------
        // Hash password
        // ---------------------------------------------

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );


        // ---------------------------------------------
        // Create user
        // ---------------------------------------------

        const result =
            await pool.query(
                `INSERT INTO users (
                    name,
                    email,
                    password_hash
                )
                VALUES (
                    $1,
                    $2,
                    $3
                )
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


        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        return res.status(201).json({
            status: "success",
            message:
                "User registered successfully.",
            user: result.rows[0]
        });


    } catch (error) {

        console.error(
            "Registration error:",
            error.message
        );

        return res.status(500).json({
            status: "error",
            message:
                "Server error during registration."
        });
    }
};


// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {

    try {

        let {
            email,
            password
        } = req.body;


        email = email
            ?.trim()
            .toLowerCase();


        // ---------------------------------------------
        // Required fields
        // ---------------------------------------------

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({
                status: "error",
                message:
                    "Email and password are required."
            });
        }


        // ---------------------------------------------
        // Find user
        // ---------------------------------------------

        const result =
            await pool.query(
                `SELECT *
                 FROM users
                 WHERE LOWER(email) = LOWER($1)`,
                [email]
            );


        if (result.rows.length === 0) {

            return res.status(401).json({
                status: "error",
                message:
                    "Invalid email or password."
            });
        }


        const user =
            result.rows[0];


        // ---------------------------------------------
        // Compare password
        // ---------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({
                status: "error",
                message:
                    "Invalid email or password."
            });
        }


        // ---------------------------------------------
        // Create JWT
        // ---------------------------------------------

        const token =
            jwt.sign(
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


        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        return res.json({
            status: "success",
            message:
                "Login successful.",

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
            message:
                "Server error during login."
        });
    }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {

    try {

        let { email } = req.body;


        email = email
            ?.trim()
            .toLowerCase();


        // ---------------------------------------------
        // Validate email
        // ---------------------------------------------

        if (!email) {

            return res.status(400).json({
                status: "error",
                message:
                    "Email address is required."
            });
        }


        // ---------------------------------------------
        // Find user
        // ---------------------------------------------

        const result =
            await pool.query(
                `SELECT
                    id,
                    email
                 FROM users
                 WHERE LOWER(email) = LOWER($1)`,
                [email]
            );


        /*
         * Do not reveal whether an account exists.
         *
         * This prevents attackers from checking
         * which email addresses are registered.
         */

        if (result.rows.length === 0) {

            return res.json({
                status: "success",
                message:
                    "If an account exists for that email, password reset instructions will be sent."
            });
        }


        const user =
            result.rows[0];


        // ---------------------------------------------
        // Generate secure reset token
        // ---------------------------------------------

        const resetToken =
            crypto
                .randomBytes(32)
                .toString("hex");


        // ---------------------------------------------
        // Hash reset token
        // ---------------------------------------------

        /*
         * Only the hash is stored in PostgreSQL.
         *
         * The raw token is sent to the user's email.
         */

        const resetTokenHash =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");


        // ---------------------------------------------
        // Token expiration - 15 minutes
        // ---------------------------------------------

        const resetExpires =
            new Date(
                Date.now() +
                15 * 60 * 1000
            );


        // ---------------------------------------------
        // Store reset token hash and expiration
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Send password reset email
        // ---------------------------------------------

        await sendPasswordResetEmail(
            user.email,
            resetToken
        );


        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        /*
         * IMPORTANT:
         *
         * We intentionally do NOT return the raw
         * reset token to the browser.
         */

        return res.json({
            status: "success",
            message:
                "If an account exists for that email, password reset instructions will be sent."
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

const resetPassword = async (
    req,
    res
) => {

    try {

        const {
            token
        } = req.params;


        const {
            password
        } = req.body;


        // ---------------------------------------------
        // Validate reset token
        // ---------------------------------------------

        if (!token) {

            return res.status(400).json({
                status: "error",
                message:
                    "Password reset token is required."
            });
        }


        // ---------------------------------------------
        // Validate password exists
        // ---------------------------------------------

        if (!password) {

            return res.status(400).json({
                status: "error",
                message:
                    "New password is required."
            });
        }


        // ---------------------------------------------
        // Validate password strength
        // ---------------------------------------------

        const passwordError =
            validatePassword(password);


        if (passwordError) {

            return res.status(400).json({
                status: "error",
                message:
                    passwordError
            });
        }


        // ---------------------------------------------
        // Hash incoming reset token
        // ---------------------------------------------

        const resetTokenHash =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        // ---------------------------------------------
        // Find valid reset token
        // ---------------------------------------------

        const result =
            await pool.query(
                `SELECT id

                 FROM users

                 WHERE password_reset_token = $1

                 AND password_reset_expires > NOW()`,
                [
                    resetTokenHash
                ]
            );


        // ---------------------------------------------
        // Invalid or expired token
        // ---------------------------------------------

        if (result.rows.length === 0) {

            return res.status(400).json({
                status: "error",
                message:
                    "This password reset link is invalid or has expired."
            });
        }


        const user =
            result.rows[0];


        // ---------------------------------------------
        // Hash new password
        // ---------------------------------------------

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );


        // ---------------------------------------------
        // Update password
        // ---------------------------------------------

        /*
         * The reset token is also deleted.
         *
         * This prevents the same reset link
         * from being used again.
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


        // ---------------------------------------------
        // Success
        // ---------------------------------------------

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