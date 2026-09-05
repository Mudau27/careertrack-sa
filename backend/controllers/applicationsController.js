const pool = require("../config/database");

// Create a new application
const createApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { job_id, status } = req.body;

        if (!job_id) {
            return res.status(400).json({
                status: "error",
                message: "Job ID is required."
            });
        }

        // Check if the job exists
        const job = await pool.query(
            "SELECT id FROM jobs WHERE id = $1",
            [job_id]
        );

        if (job.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Job not found."
            });
        }

        // Check if user already applied
        const existingApplication = await pool.query(
            `SELECT id
             FROM applications
             WHERE user_id = $1 AND job_id = $2`,
            [userId, job_id]
        );

        if (existingApplication.rows.length > 0) {
            return res.status(409).json({
                status: "error",
                message: "You have already applied for this job."
            });
        }

        const result = await pool.query(
            `INSERT INTO applications
                (user_id, job_id, status)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, job_id, status || "Applied"]
        );

        res.status(201).json({
            status: "success",
            message: "Application created successfully.",
            application: result.rows[0]
        });

    } catch (error) {
        console.error("Create application error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while creating application."
        });
    }
};


// Get all applications for logged-in user
const getApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                a.id,
                a.job_id,
                j.title,
                j.company,
                j.location,
                a.status,
                a.applied_date
             FROM applications a
             INNER JOIN jobs j ON a.job_id = j.id
             WHERE a.user_id = $1
             ORDER BY a.applied_date DESC, a.id DESC`,
            [userId]
        );

        res.json({
            status: "success",
            count: result.rows.length,
            applications: result.rows
        });

    } catch (error) {
        console.error("Get applications error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while retrieving applications."
        });
    }
};


// Get one application
const getApplicationById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                a.id,
                a.job_id,
                j.title,
                j.company,
                j.location,
                a.status,
                a.applied_date
             FROM applications a
             INNER JOIN jobs j ON a.job_id = j.id
             WHERE a.id = $1 AND a.user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Application not found."
            });
        }

        res.json({
            status: "success",
            application: result.rows[0]
        });

    } catch (error) {
        console.error("Get application error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while retrieving application."
        });
    }
};


// Update application status
const updateApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                status: "error",
                message: "Status is required."
            });
        }

        const result = await pool.query(
            `UPDATE applications
             SET status = $1
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [status, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Application not found."
            });
        }

        res.json({
            status: "success",
            message: "Application updated successfully.",
            application: result.rows[0]
        });

    } catch (error) {
        console.error("Update application error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while updating application."
        });
    }
};


// Delete an application
const deleteApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM applications
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Application not found."
            });
        }

        res.json({
            status: "success",
            message: "Application deleted successfully."
        });

    } catch (error) {
        console.error("Delete application error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while deleting application."
        });
    }
};


module.exports = {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
};