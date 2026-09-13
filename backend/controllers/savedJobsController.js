const pool = require(
    "../config/database"
);


// ==========================================
// SAVE JOB
// ==========================================

const saveJob = async (req, res) => {
    try {
        const userId =
            req.user.id;

        const {
            id: jobId
        } = req.params;


        // Check job exists
        const job =
            await pool.query(
                `SELECT id
                 FROM jobs
                 WHERE id = $1`,
                [jobId]
            );


        if (
            job.rows.length === 0
        ) {
            return res
                .status(404)
                .json({
                    status: "error",
                    message:
                        "Job not found."
                });
        }


        // Check if already saved
        const existingSavedJob =
            await pool.query(
                `SELECT id
                 FROM saved_jobs
                 WHERE user_id = $1
                 AND job_id = $2`,
                [
                    userId,
                    jobId
                ]
            );


        if (
            existingSavedJob.rows
                .length > 0
        ) {
            return res
                .status(409)
                .json({
                    status: "error",
                    message:
                        "Job is already saved."
                });
        }


        // Save job
        const result =
            await pool.query(
                `INSERT INTO saved_jobs
                    (
                        user_id,
                        job_id
                    )
                 VALUES
                    ($1, $2)
                 RETURNING *`,
                [
                    userId,
                    jobId
                ]
            );


        res.status(201).json({
            status: "success",
            message:
                "Job saved successfully.",
            savedJob:
                result.rows[0]
        });


    } catch (error) {
        console.error(
            "Save job error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while saving job."
        });
    }
};


// ==========================================
// REMOVE SAVED JOB
// ==========================================

const removeSavedJob = async (
    req,
    res
) => {
    try {
        const userId =
            req.user.id;

        const {
            id: jobId
        } = req.params;


        const result =
            await pool.query(
                `DELETE FROM saved_jobs
                 WHERE user_id = $1
                 AND job_id = $2
                 RETURNING *`,
                [
                    userId,
                    jobId
                ]
            );


        if (
            result.rows.length === 0
        ) {
            return res
                .status(404)
                .json({
                    status: "error",
                    message:
                        "Saved job not found."
                });
        }


        res.json({
            status: "success",
            message:
                "Job removed from saved jobs."
        });


    } catch (error) {
        console.error(
            "Remove saved job error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while removing saved job."
        });
    }
};


// ==========================================
// GET SAVED JOBS
// ==========================================

const getSavedJobs = async (
    req,
    res
) => {
    try {
        const userId =
            req.user.id;


        const result =
            await pool.query(
                `SELECT
                    s.id AS saved_id,

                    j.id AS job_id,

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

                 INNER JOIN jobs j
                 ON s.job_id = j.id

                 WHERE s.user_id = $1

                 ORDER BY
                    s.saved_at DESC`,
                [userId]
            );


        res.json({
            status: "success",

            count:
                result.rows.length,

            jobs:
                result.rows
        });


    } catch (error) {
        console.error(
            "Get saved jobs error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while retrieving saved jobs."
        });
    }
};


module.exports = {
    saveJob,
    removeSavedJob,
    getSavedJobs
};