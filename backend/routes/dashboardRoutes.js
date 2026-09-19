const express = require("express");

const {
    getDashboardStatistics
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET DASHBOARD STATISTICS
// ==========================================

/**
 * @swagger
 * /api/dashboard/statistics:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns job application statistics for the authenticated user, including totals, recent applications, interviews, offers, rejections, interview rate, and applications grouped by status.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
 *                     total_applications:
 *                       type: integer
 *                       example: 6
 *                     recent_applications:
 *                       type: integer
 *                       example: 4
 *                     interviews:
 *                       type: integer
 *                       example: 3
 *                     offers:
 *                       type: integer
 *                       example: 1
 *                     rejected:
 *                       type: integer
 *                       example: 1
 *                     interview_rate:
 *                       type: number
 *                       format: float
 *                       example: 50
 *                     applications_by_status:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         Applied: 1
 *                         Interview: 3
 *                         Offer: 1
 *                         Rejected: 1
 *       401:
 *         description: Unauthorized - missing, invalid, or expired JWT
 *       500:
 *         description: Server error while retrieving dashboard statistics
 */

router.get(
    "/statistics",
    protect,
    getDashboardStatistics
);


module.exports = router;