const pool = require("../config/database");

// Get dashboard statistics for logged-in user
const getDashboardStatistics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Total applications
        const totalResult = await pool.query(
            `SELECT COUNT(*) AS total
             FROM applications
             WHERE user_id = $1`,
            [userId]
        );

        // Applications by status
        const statusResult = await pool.query(
            `SELECT status, COUNT(*) AS count
             FROM applications
             WHERE user_id = $1
             GROUP BY status
             ORDER BY status`,
            [userId]
        );

        // Applications submitted recently
        const recentResult = await pool.query(
            `SELECT COUNT(*) AS recent
             FROM applications
             WHERE user_id = $1
             AND applied_date >= CURRENT_DATE - INTERVAL '30 days'`,
            [userId]
        );

        const totalApplications = Number(totalResult.rows[0].total);
        const recentApplications = Number(recentResult.rows[0].recent);

        const statusCounts = {};

        statusResult.rows.forEach((row) => {
            statusCounts[row.status] = Number(row.count);
        });

        const interviews = statusCounts["Interview"] || 0;
        const offers = statusCounts["Offer"] || 0;
        const rejected = statusCounts["Rejected"] || 0;

        const interviewRate =
            totalApplications > 0
                ? Number(((interviews / totalApplications) * 100).toFixed(2))
                : 0;

        res.json({
            status: "success",
            statistics: {
                total_applications: totalApplications,
                recent_applications: recentApplications,
                interviews,
                offers,
                rejected,
                interview_rate: interviewRate,
                applications_by_status: statusCounts
            }
        });

    } catch (error) {
        console.error("Dashboard statistics error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while retrieving dashboard statistics."
        });
    }
};

module.exports = {
    getDashboardStatistics
};