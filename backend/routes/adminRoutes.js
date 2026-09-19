const express = require("express");

const {
    getAdminStatistics,
    getUsers,
    updateUserRole,
    deleteUser,
    getJobs,
    deleteJob,
    getApplications
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// ==========================================
// ALL ADMIN ROUTES REQUIRE AUTH + ADMIN ROLE
// ==========================================

router.use(
    protect,
    adminOnly
);


// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Returns platform-wide statistics. Requires an authenticated administrator.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     total_users:
 *                       type: integer
 *                       example: 2
 *                     total_admins:
 *                       type: integer
 *                       example: 1
 *                     total_jobs:
 *                       type: integer
 *                       example: 6
 *                     total_applications:
 *                       type: integer
 *                       example: 5
 *                     total_interviews:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Authentication required or invalid token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error while retrieving admin statistics
 */
router.get(
    "/statistics",
    getAdminStatistics
);


// ==========================================
// GET ALL USERS
// ==========================================

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Returns all registered CareerTrack SA users. Admin access is required.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Test User
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: test@example.com
 *                       role:
 *                         type: string
 *                         enum:
 *                           - user
 *                           - admin
 *                         example: user
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Authentication required or invalid token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error while retrieving users
 */
router.get(
    "/users",
    getUsers
);


// ==========================================
// UPDATE USER ROLE
// ==========================================

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: Update a user's role
 *     description: Changes a user's role to either user or admin. Admin access is required.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose role will be updated
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *                 example: user
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User role updated successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: Test User
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: test@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Role must be either user or admin
 *       401:
 *         description: Authentication required or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while updating user role
 */
router.put(
    "/users/:id/role",
    updateUserRole
);


// ==========================================
// DELETE USER
// ==========================================

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user account. An administrator cannot delete their own admin account.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *         example: 2
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Administrator attempted to delete their own account
 *       401:
 *         description: Authentication required or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while deleting user
 */
router.delete(
    "/users/:id",
    deleteUser
);


// ==========================================
// GET ALL JOBS
// ==========================================

/**
 * @swagger
 * /api/admin/jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Returns all jobs in CareerTrack SA for administration.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                   example: 6
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       title:
 *                         type: string
 *                         example: Graduate Software Developer
 *                       company:
 *                         type: string
 *                         example: Tech Solutions SA
 *                       location:
 *                         type: string
 *                         example: Johannesburg, South Africa
 *                       employment_type:
 *                         type: string
 *                         example: Full-time
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Authentication required or invalid token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error while retrieving jobs
 */
router.get(
    "/jobs",
    getJobs
);


// ==========================================
// DELETE JOB
// ==========================================

/**
 * @swagger
 * /api/admin/jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     description: Deletes a job from CareerTrack SA. Admin access is required.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job to delete
 *         example: 5
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Authentication required or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error while deleting job
 */
router.delete(
    "/jobs/:id",
    deleteJob
);


// ==========================================
// GET ALL APPLICATIONS
// ==========================================

/**
 * @swagger
 * /api/admin/applications:
 *   get:
 *     summary: Get all applications
 *     description: Returns all job applications across all CareerTrack SA users. Admin access is required.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 6
 *                       status:
 *                         type: string
 *                         example: Interview
 *                       applied_date:
 *                         type: string
 *                         format: date-time
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       user_name:
 *                         type: string
 *                         example: Test User
 *                       user_email:
 *                         type: string
 *                         format: email
 *                         example: test@example.com
 *                       job_id:
 *                         type: integer
 *                         example: 5
 *                       title:
 *                         type: string
 *                         example: Graduate Software Developer
 *                       company:
 *                         type: string
 *                         example: Tech Solutions SA
 *                       location:
 *                         type: string
 *                         example: Johannesburg, South Africa
 *       401:
 *         description: Authentication required or invalid token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error while retrieving applications
 */
router.get(
    "/applications",
    getApplications
);


module.exports = router;