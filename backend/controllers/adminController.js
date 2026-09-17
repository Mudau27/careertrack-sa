const pool = require("../config/database");


// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

const getAdminStatistics = async (req, res) => {
    try {
        const usersResult = await pool.query(
            `SELECT COUNT(*)::int AS total_users
             FROM users`
        );

        const jobsResult = await pool.query(
            `SELECT COUNT(*)::int AS total_jobs
             FROM jobs`
        );

        const applicationsResult = await pool.query(
            `SELECT COUNT(*)::int AS total_applications
             FROM applications`
        );

        const interviewsResult = await pool.query(
            `SELECT COUNT(*)::int AS total_interviews
             FROM interviews`
        );

        const adminsResult = await pool.query(
            `SELECT COUNT(*)::int AS total_admins
             FROM users
             WHERE role = 'admin'`
        );

        res.json({
            status: "success",
            statistics: {
                total_users:
                    usersResult.rows[0].total_users,
                total_admins:
                    adminsResult.rows[0].total_admins,
                total_jobs:
                    jobsResult.rows[0].total_jobs,
                total_applications:
                    applicationsResult.rows[0]
                        .total_applications,
                total_interviews:
                    interviewsResult.rows[0]
                        .total_interviews
            }
        });

    } catch (error) {
        console.error(
            "Admin statistics error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while retrieving admin statistics."
        });
    }
};


// ==========================================
// GET ALL USERS
// ==========================================

const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                created_at
             FROM users
             ORDER BY created_at DESC`
        );

        res.json({
            status: "success",
            count: result.rows.length,
            users: result.rows
        });

    } catch (error) {
        console.error(
            "Get users error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while retrieving users."
        });
    }
};


// ==========================================
// UPDATE USER ROLE
// ==========================================

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = [
            "user",
            "admin"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                status: "error",
                message:
                    "Role must be either user or admin."
            });
        }

        const result = await pool.query(
            `UPDATE users
             SET role = $1
             WHERE id = $2
             RETURNING
                id,
                name,
                email,
                role,
                created_at`,
            [
                role,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message:
                    "User not found."
            });
        }

        res.json({
            status: "success",
            message:
                "User role updated successfully.",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Update user role error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while updating user role."
        });
    }
};


// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { id } = req.params;

        if (
            Number(id) === Number(adminId)
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "You cannot delete your own admin account."
            });
        }

        const result = await pool.query(
            `DELETE FROM users
             WHERE id = $1
             RETURNING
                id,
                name,
                email`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message:
                    "User not found."
            });
        }

        res.json({
            status: "success",
            message:
                "User deleted successfully."
        });

    } catch (error) {
        console.error(
            "Delete user error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while deleting user."
        });
    }
};


// ==========================================
// GET ALL JOBS
// ==========================================

const getJobs = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                title,
                company,
                location,
                employment_type,
                created_at
             FROM jobs
             ORDER BY created_at DESC`
        );

        res.json({
            status: "success",
            count: result.rows.length,
            jobs: result.rows
        });

    } catch (error) {
        console.error(
            "Admin get jobs error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while retrieving jobs."
        });
    }
};


// ==========================================
// DELETE JOB
// ==========================================

const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM jobs
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message:
                    "Job not found."
            });
        }

        res.json({
            status: "success",
            message:
                "Job deleted successfully."
        });

    } catch (error) {
        console.error(
            "Delete job error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while deleting job."
        });
    }
};


// ==========================================
// GET ALL APPLICATIONS
// ==========================================

const getApplications = async (
    req,
    res
) => {
    try {
        const result = await pool.query(
            `SELECT
                a.id,
                a.status,
                a.applied_date,

                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,

                j.id AS job_id,
                j.title,
                j.company,
                j.location

             FROM applications a

             INNER JOIN users u
                ON a.user_id = u.id

             INNER JOIN jobs j
                ON a.job_id = j.id

             ORDER BY a.applied_date DESC`
        );

        res.json({
            status: "success",
            count: result.rows.length,
            applications: result.rows
        });

    } catch (error) {
        console.error(
            "Admin get applications error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while retrieving applications."
        });
    }
};


module.exports = {
    getAdminStatistics,
    getUsers,
    updateUserRole,
    deleteUser,
    getJobs,
    deleteJob,
    getApplications
};