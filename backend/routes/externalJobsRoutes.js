const express = require("express");

const {
    searchExternalJobs,
    saveExternalJob
} = require("../controllers/externalJobsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// SEARCH EXTERNAL JOBS
// ==========================================

/**
 * @swagger
 * /api/external-jobs/search:
 *   get:
 *     summary: Search external jobs
 *     description: >
 *       Searches for current South African job listings using the
 *       external Adzuna Jobs API.
 *     tags:
 *       - External Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: what
 *         required: false
 *         schema:
 *           type: string
 *         description: Job title, keyword, or skill to search for
 *         example: Software Developer
 *       - in: query
 *         name: where
 *         required: false
 *         schema:
 *           type: string
 *         description: Location to search
 *         example: Johannesburg
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Results page number
 *         example: 1
 *     responses:
 *       200:
 *         description: External jobs retrieved successfully
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
 *                   example: 20
 *                 total:
 *                   type: integer
 *                   example: 250
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       external_id:
 *                         type: string
 *                         example: "123456789"
 *                       title:
 *                         type: string
 *                         example: Graduate Software Developer
 *                       company:
 *                         type: string
 *                         example: Example Technology Company
 *                       location:
 *                         type: string
 *                         example: Johannesburg, Gauteng
 *                       description:
 *                         type: string
 *                         example: Graduate software development opportunity.
 *                       salary_min:
 *                         type: number
 *                         nullable: true
 *                         example: 18000
 *                       salary_max:
 *                         type: number
 *                         nullable: true
 *                         example: 25000
 *                       created:
 *                         type: string
 *                         nullable: true
 *                         example: "2026-09-19T08:00:00Z"
 *                       redirect_url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://example.com/job/123456789"
 *                       category:
 *                         type: string
 *                         nullable: true
 *                         example: IT Jobs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: >
 *           Adzuna credentials are missing or an error occurred while
 *           retrieving external jobs.
 */
router.get(
    "/search",
    protect,
    searchExternalJobs
);


// ==========================================
// SAVE EXTERNAL JOB
// ==========================================

/**
 * @swagger
 * /api/external-jobs/save:
 *   post:
 *     summary: Save an external job
 *     description: >
 *       Imports an external job into CareerTrack SA when necessary
 *       and saves it to the authenticated user's saved jobs.
 *       Existing jobs are identified using their external job URL.
 *     tags:
 *       - External Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - external_id
 *               - title
 *               - company
 *               - redirect_url
 *             properties:
 *               external_id:
 *                 type: string
 *                 example: "123456789"
 *               title:
 *                 type: string
 *                 example: Graduate Software Developer
 *               company:
 *                 type: string
 *                 example: Example Technology Company
 *               location:
 *                 type: string
 *                 example: Johannesburg, Gauteng
 *               description:
 *                 type: string
 *                 example: Graduate software development opportunity.
 *               salary_min:
 *                 type: number
 *                 nullable: true
 *                 example: 18000
 *               salary_max:
 *                 type: number
 *                 nullable: true
 *                 example: 25000
 *               redirect_url:
 *                 type: string
 *                 example: "https://example.com/job/123456789"
 *               category:
 *                 type: string
 *                 nullable: true
 *                 example: IT Jobs
 *     responses:
 *       201:
 *         description: External job saved successfully
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
 *                   example: External job saved successfully.
 *                 job_id:
 *                   type: integer
 *                   example: 6
 *                 savedJob:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     job_id:
 *                       type: integer
 *                       example: 6
 *                     saved_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Required job information or external job URL is missing
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Job is already saved by the user
 *       500:
 *         description: Server or database error while saving external job
 */
router.post(
    "/save",
    protect,
    saveExternalJob
);


module.exports = router;