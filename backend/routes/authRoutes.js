const express = require("express");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new CareerTrack SA user account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test User
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: StrongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration information
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

router.post(
    "/register",
    registerUser
);


// ==========================================
// LOGIN
// ==========================================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

router.post(
    "/login",
    loginUser
);


// ==========================================
// FORGOT PASSWORD
// ==========================================

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: Creates a temporary password reset token for an account. During development, the token is returned in the response for testing.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset request processed
 *       400:
 *         description: Email address is required
 *       500:
 *         description: Server error
 */

router.post(
    "/forgot-password",
    forgotPassword
);


// ==========================================
// RESET PASSWORD
// ==========================================

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset account password
 *     description: Sets a new password using a valid, unexpired password reset token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: NewStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 *       500:
 *         description: Server error
 */

router.post(
    "/reset-password/:token",
    resetPassword
);


// ==========================================
// CURRENT USER / AUTH TEST
// ==========================================

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user
 *     description: Tests JWT authentication and returns the authenticated user's token information.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Missing, invalid, or expired JWT
 */

router.get(
    "/me",
    protect,
    (req, res) => {
        res.json({
            status: "success",
            message: "You are authenticated!",
            user: req.user
        });
    }
);


module.exports = router;