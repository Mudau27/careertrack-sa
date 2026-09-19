const express = require("express");

const {
    saveJob,
    removeSavedJob,
    getSavedJobs
} = require("../controllers/savedJobsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// SAVE JOB
// ==========================================

/**
 * @swagger
 * /api/jobs/{id}/save:
 *   post:
 *     summary: Save a job
 *     description: Saves a job to the authenticated user's saved jobs list.
 *     tags:
 *       - Saved Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job to save
 *         example: 5
 *     responses:
 *       201:
 *         description: Job saved successfully
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
 *                   example: Job saved successfully.
 *                 savedJob:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     job_id:
 *                       type: integer
 *                       example: 5
 *                     saved_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       409:
 *         description: Job is already saved
 *       500:
 *         description: Server error while saving job
 */
router.post(
    "/jobs/:id/save",
    protect,
    saveJob
);


// ==========================================
// REMOVE SAVED JOB
// ==========================================

/**
 * @swagger
 * /api/jobs/{id}/save:
 *   delete:
 *     summary: Remove a saved job
 *     description: Removes a job from the authenticated user's saved jobs list.
 *     tags:
 *       - Saved Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job to remove from saved jobs
 *         example: 5
 *     responses:
 *       200:
 *         description: Job removed from saved jobs successfully
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
 *                   example: Job removed from saved jobs.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Saved job not found
 *       500:
 *         description: Server error while removing saved job
 */
router.delete(
    "/jobs/:id/save",
    protect,
    removeSavedJob
);


// ==========================================
// GET SAVED JOBS
// ==========================================

/**
 * @swagger
 * /api/users/saved-jobs:
 *   get:
 *     summary: Get the user's saved jobs
 *     description: Returns all jobs saved by the authenticated user.
 *     tags:
 *       - Saved Jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved jobs retrieved successfully
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
 *                   example: 1
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       saved_id:
 *                         type: integer
 *                         example: 1
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
 *                       description:
 *                         type: string
 *                         example: Graduate software development opportunity.
 *                       requirements:
 *                         type: string
 *                         example: JavaScript, Node.js, SQL, Git
 *                       salary_min:
 *                         type: number
 *                         example: 18000
 *                       salary_max:
 *                         type: number
 *                         example: 25000
 *                       employment_type:
 *                         type: string
 *                         example: Full-time
 *                       job_url:
 *                         type: string
 *                         example: https://example.com/jobs/graduate-developer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error while retrieving saved jobs
 */
router.get(
    "/users/saved-jobs",
    protect,
    getSavedJobs
);


module.exports = router;