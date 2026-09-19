const express = require("express");

const {
    getJobs,
    getJobById,
    createJob
} = require("../controllers/jobsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL JOBS
// ==========================================

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Returns all jobs available in CareerTrack SA.
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *       500:
 *         description: Server error while retrieving jobs
 */

router.get(
    "/",
    getJobs
);


// ==========================================
// GET JOB BY ID
// ==========================================

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     description: Returns information about a specific CareerTrack SA job.
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error while retrieving job
 */

router.get(
    "/:id",
    getJobById
);


// ==========================================
// CREATE JOB
// ==========================================

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     description: Creates a new job in CareerTrack SA. JWT authentication is required.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *             properties:
 *               title:
 *                 type: string
 *                 example: Graduate Software Developer
 *               company:
 *                 type: string
 *                 example: Tech Solutions SA
 *               location:
 *                 type: string
 *                 example: Johannesburg, South Africa
 *               description:
 *                 type: string
 *                 example: Graduate software development opportunity.
 *               requirements:
 *                 type: string
 *                 example: JavaScript, Node.js, SQL, Git
 *               salary_min:
 *                 type: number
 *                 format: float
 *                 example: 18000
 *               salary_max:
 *                 type: number
 *                 format: float
 *                 example: 25000
 *               employment_type:
 *                 type: string
 *                 example: Full-time
 *               job_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/jobs/graduate-developer
 *               source:
 *                 type: string
 *                 example: CareerTrack
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Title and company are required
 *       401:
 *         description: Missing, invalid, or expired JWT
 *       500:
 *         description: Server error while creating job
 */

router.post(
    "/",
    protect,
    createJob
);


module.exports = router;