const express = require("express");

const {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
} = require("../controllers/applicationsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE APPLICATION
// ==========================================

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create a job application
 *     description: Creates an application for the authenticated user. A user cannot apply for the same job more than once.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *             properties:
 *               job_id:
 *                 type: integer
 *                 example: 5
 *               status:
 *                 type: string
 *                 example: Applied
 *                 description: Application status. Defaults to Applied when omitted.
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Job ID is required
 *       401:
 *         description: Missing, invalid, or expired JWT
 *       404:
 *         description: Job not found
 *       409:
 *         description: User has already applied for this job
 *       500:
 *         description: Server error while creating application
 */

router.post(
    "/",
    protect,
    createApplication
);


// ==========================================
// GET ALL APPLICATIONS
// ==========================================

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get user's applications
 *     description: Returns all job applications belonging to the authenticated user.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *       401:
 *         description: Missing, invalid, or expired JWT
 *       500:
 *         description: Server error while retrieving applications
 */

router.get(
    "/",
    protect,
    getApplications
);


// ==========================================
// GET APPLICATION BY ID
// ==========================================

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get an application by ID
 *     description: Returns a specific application belonging to the authenticated user.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *       401:
 *         description: Missing, invalid, or expired JWT
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error while retrieving application
 */

router.get(
    "/:id",
    protect,
    getApplicationById
);


// ==========================================
// UPDATE APPLICATION
// ==========================================

/**
 * @swagger
 * /api/applications/{id}:
 *   put:
 *     summary: Update application status
 *     description: Updates the status of an application belonging to the authenticated user.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: Interview
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       400:
 *         description: Status is required
 *       401:
 *         description: Missing, invalid, or expired JWT
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error while updating application
 */

router.put(
    "/:id",
    protect,
    updateApplication
);


// ==========================================
// DELETE APPLICATION
// ==========================================

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     description: Deletes an application belonging to the authenticated user.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       401:
 *         description: Missing, invalid, or expired JWT
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error while deleting application
 */

router.delete(
    "/:id",
    protect,
    deleteApplication
);


module.exports = router;