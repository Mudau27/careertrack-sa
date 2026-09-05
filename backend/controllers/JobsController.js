const pool = require("../config/database");

// Get all jobs
const getJobs = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                title,
                company,
                location,
                description,
                requirements,
                salary_min,
                salary_max,
                employment_type,
                job_url,
                source,
                created_at
             FROM jobs
             ORDER BY id DESC`
        );

        res.json({
            status: "success",
            count: result.rows.length,
            jobs: result.rows
        });

    } catch (error) {
        console.error("Get jobs error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while retrieving jobs."
        });
    }
};


// Get one job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                id,
                title,
                company,
                location,
                description,
                requirements,
                salary_min,
                salary_max,
                employment_type,
                job_url,
                source,
                created_at
             FROM jobs
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Job not found."
            });
        }

        res.json({
            status: "success",
            job: result.rows[0]
        });

    } catch (error) {
        console.error("Get job error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while retrieving job."
        });
    }
};


// Create a new job
const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            description,
            requirements,
            salary_min,
            salary_max,
            employment_type,
            job_url,
            source
        } = req.body;

        if (!title || !company) {
            return res.status(400).json({
                status: "error",
                message: "Title and company are required."
            });
        }

        const result = await pool.query(
            `INSERT INTO jobs
                (
                    title,
                    company,
                    location,
                    description,
                    requirements,
                    salary_min,
                    salary_max,
                    employment_type,
                    job_url,
                    source
                )
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             RETURNING *`,
            [
                title,
                company,
                location || null,
                description || null,
                requirements || null,
                salary_min || null,
                salary_max || null,
                employment_type || null,
                job_url || null,
                source || null
            ]
        );

        res.status(201).json({
            status: "success",
            message: "Job created successfully.",
            job: result.rows[0]
        });

    } catch (error) {
        console.error("Create job error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while creating job."
        });
    }
};


module.exports = {
    getJobs,
    getJobById,
    createJob
};