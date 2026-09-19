const express = require("express");

const {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
} = require("../controllers/interviewsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE INTERVIEW
// ==========================================

/**
 * @swagger
 * /api/interviews:
 *   post:
 *     summary: Schedule an interview
 *     description: Creates an interview for one of the authenticated user's job applications.
 *     tags:
 *       - Interviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - application_id
 *               - interview_date
 *             properties:
 *               application_id:
 *                 type: integer
 *                 example: 6
 *               interview_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-25T10:00:00"
 *               interview_type:
 *                 type: string
 *                 example: "Technical Interview"
 *               location:
 *                 type: string
 *                 example: "Microsoft Teams"
 *               notes:
 *                 type: string
 *                 example: "Prepare for JavaScript, Node.js and SQL questions."
 *     responses:
 *       201:
 *         description: Interview scheduled successfully
 *       400:
 *         description: Application ID or interview date is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       409:
 *         description: Interview already exists for this application
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    protect,
    createInterview
);


// ==========================================
// GET ALL INTERVIEWS
// ==========================================

/**
 * @swagger
 * /api/interviews:
 *   get:
 *     summary: Get all interviews
 *     description: Returns all interviews belonging to the authenticated user.
 *     tags:
 *       - Interviews
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interviews retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    protect,
    getInterviews
);


// ==========================================
// GET ONE INTERVIEW
// ==========================================

/**
 * @swagger
 * /api/interviews/{id}:
 *   get:
 *     summary: Get an interview by ID
 *     description: Returns one interview belonging to the authenticated user.
 *     tags:
 *       - Interviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Interview ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Interview retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Interview not found
 *       500:
 *         description: Server error
 */
router.get(
    "/:id",
    protect,
    getInterviewById
);


// ==========================================
// UPDATE INTERVIEW
// ==========================================

/**
 * @swagger
 * /api/interviews/{id}:
 *   put:
 *     summary: Update an interview
 *     description: Updates an interview belonging to the authenticated user.
 *     tags:
 *       - Interviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Interview ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interview_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-25T11:00:00"
 *               interview_type:
 *                 type: string
 *                 example: "Technical Interview"
 *               location:
 *                 type: string
 *                 example: "Microsoft Teams"
 *               notes:
 *                 type: string
 *                 example: "Updated interview preparation notes."
 *     responses:
 *       200:
 *         description: Interview updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Interview not found
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    protect,
    updateInterview
);


// ==========================================
// DELETE INTERVIEW
// ==========================================

/**
 * @swagger
 * /api/interviews/{id}:
 *   delete:
 *     summary: Delete an interview
 *     description: Deletes an interview belonging to the authenticated user.
 *     tags:
 *       - Interviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Interview ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Interview deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Interview not found
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    protect,
    deleteInterview
);


module.exports = router;