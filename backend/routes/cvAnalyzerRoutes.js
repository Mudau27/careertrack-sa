const express = require("express");

const {
    analyzeUserCV
} = require("../controllers/cvAnalyzerController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// ANALYZE USER CV
// ==========================================

/**
 * @swagger
 * /api/cv-analyzer/analyze:
 *   post:
 *     summary: Analyze the user's CV against a job description
 *     description: >
 *       Analyzes the authenticated user's uploaded PDF CV against a supplied
 *       job description and returns an ATS-style analysis including matching
 *       skills, missing skills, section checks, quality checks, scores,
 *       rating, and recommendations.
 *     tags:
 *       - CV Analyzer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobDescription
 *             properties:
 *               jobDescription:
 *                 type: string
 *                 example: >
 *                   We are looking for a Graduate Software Developer with
 *                   experience in JavaScript, Node.js, SQL, Git, REST APIs
 *                   and React. Knowledge of cloud technologies is beneficial.
 *     responses:
 *       200:
 *         description: CV analysis completed successfully
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
 *                   example: CV analysis completed successfully.
 *                 analysis:
 *                   type: object
 *                   description: ATS-style CV analysis results
 *                   properties:
 *                     atsScore:
 *                       type: number
 *                       example: 78
 *                     skillMatchScore:
 *                       type: number
 *                       example: 80
 *                     sectionScore:
 *                       type: number
 *                       example: 75
 *                     qualityScore:
 *                       type: number
 *                       example: 70
 *                     matchScore:
 *                       type: number
 *                       example: 80
 *                     rating:
 *                       type: string
 *                       example: Good Match
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - Add missing job-specific technical skills where applicable.
 *                         - Strengthen your professional summary.
 *       400:
 *         description: >
 *           Job description is missing, CV has not been uploaded,
 *           CV is not a PDF, or no readable text was found in the CV.
 *       401:
 *         description: Unauthorized - missing, invalid, or expired JWT
 *       404:
 *         description: User profile or uploaded CV file not found
 *       500:
 *         description: Server error while analyzing the CV
 */

router.post(
    "/analyze",
    protect,
    analyzeUserCV
);


module.exports = router;