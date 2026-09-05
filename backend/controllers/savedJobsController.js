const pool = require("../config/database");

// Save a job
const saveJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: jobId } = req.params;

        const job = await pool.query(
            "SELECT id FROM jobs WHERE id = $1",
            [jobId]
        );

        if (job.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Job not found."
            });
        }

        const result = await pool.query(
            `INSERT INTO saved_jobs (user_id, job_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, job_id)
             DO NOTHING
             RETURNING *`,
            [userId, jobId]
        );

        if (result.rows.length === 0) {
            return res.status(409).json({
                status: "error",
                message: "Job is already saved."
            });
        }

        res.status(201).json({
            status: "success",
            message: "Job saved successfully.",
            savedJob: result.rows[0]
        });

    } catch (error) {
        console.error("Save job error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while saving job."
        });
    }
};


// Remove a saved job
const removeSavedJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: jobId } = req.params;

        const result = await pool.query(
            `DELETE FROM saved_jobs
             WHERE user_id = $1 AND job_id = $2
             RETURNING *`,
            [userId, jobId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Saved job not found."
            });
        }

        res.json({
            status: "success",
            message: "Job removed from saved jobs."
        });

    } catch (error) {
        console.error("Remove saved job error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while removing saved job."
        });
    }
};


// Get logged-in user's saved jobs
const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                j.id,
                j.title,
                j.company,
                j.location,
                j.description,
                j.requirements,
                j.salary_min,
                j.salary_max,
                j.employment_type,
                j.job_url
             FROM saved_jobs s
             INNER JOIN jobs j ON s.job_id = j.id
             WHERE s.user_id = $1
             ORDER BY j.id DESC`,
            [userId]
        );

        res.json({
            status: "success",
            count: result.rows.length,
            jobs: result.rows
        });

    } catch (error) {
        console.error("Get saved jobs error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while retrieving saved jobs."
        });
    }
};


module.exports = {
    saveJob,
    removeSavedJob,
    getSavedJobs
};