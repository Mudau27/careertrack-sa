const pool = require("../config/database");


// ======================================================
// SEARCH EXTERNAL JOBS
// ======================================================

const searchExternalJobs = async (req, res) => {
    try {
        const {
            what = "",
            where = "",
            page = 1
        } = req.query;

        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;

        if (!appId || !appKey) {
            return res.status(500).json({
                status: "error",
                message: "Adzuna API credentials are missing."
            });
        }

        const url =
            `https://api.adzuna.com/v1/api/jobs/za/search/${page}` +
            `?app_id=${encodeURIComponent(appId)}` +
            `&app_key=${encodeURIComponent(appKey)}` +
            `&results_per_page=20` +
            `&content-type=application/json` +
            `&what=${encodeURIComponent(what)}` +
            `&where=${encodeURIComponent(where)}`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();

            console.error(
                "Adzuna error:",
                response.status,
                errorText
            );

            return res.status(response.status).json({
                status: "error",
                message: "Failed to retrieve jobs from Adzuna."
            });
        }

        const data = await response.json();

        const jobs = (data.results || []).map((job) => ({
            external_id: String(job.id),

            title:
                job.title ||
                "Untitled Job",

            company:
                job.company?.display_name ||
                "Unknown company",

            location:
                job.location?.display_name ||
                "South Africa",

            description:
                job.description ||
                "",

            salary_min:
                job.salary_min ||
                null,

            salary_max:
                job.salary_max ||
                null,

            created:
                job.created ||
                null,

            redirect_url:
                job.redirect_url ||
                null,

            category:
                job.category?.label ||
                null
        }));

        res.json({
            status: "success",
            count: jobs.length,
            total: data.count || 0,
            page: Number(page),
            jobs
        });

    } catch (error) {
        console.error(
            "External jobs error:",
            error
        );

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


// ======================================================
// SAVE EXTERNAL JOB
// ======================================================

const saveExternalJob = async (req, res) => {
    const client = await pool.connect();

    try {
        const userId = req.user.id;

        const {
            external_id,
            title,
            company,
            location,
            description,
            salary_min,
            salary_max,
            redirect_url,
            category
        } = req.body;

        console.log(
            "Saving external job:",
            external_id,
            title
        );

        if (!external_id || !title || !company) {
            return res.status(400).json({
                status: "error",
                message: "Job information is incomplete."
            });
        }

        if (!redirect_url) {
            return res.status(400).json({
                status: "error",
                message: "External job URL is missing."
            });
        }

        await client.query("BEGIN");


        // Check whether external job already exists
        const existingJob = await client.query(
            `SELECT id
             FROM jobs
             WHERE job_url = $1
             LIMIT 1`,
            [redirect_url]
        );

        let jobId;


        // Use existing job
        if (existingJob.rows.length > 0) {

            jobId = existingJob.rows[0].id;

        } else {

            // Import external job into jobs table
            const insertedJob = await client.query(
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
                        job_url
                    )

                 VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9)

                 RETURNING id`,
                [
                    title,
                    company,
                    location || "South Africa",
                    description || "No description provided.",

                    category
                        ? `Category: ${category}`
                        : "See external job listing for requirements.",

                    salary_min || null,
                    salary_max || null,
                    "External",
                    redirect_url
                ]
            );

            jobId = insertedJob.rows[0].id;
        }


        // Check whether user already saved job
        const existingSaved = await client.query(
            `SELECT id
             FROM saved_jobs
             WHERE user_id = $1
             AND job_id = $2`,
            [
                userId,
                jobId
            ]
        );


        if (existingSaved.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                status: "error",
                message: "Job is already saved."
            });
        }


        // Save job
        const savedJob = await client.query(
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


        await client.query("COMMIT");


        res.status(201).json({
            status: "success",
            message: "External job saved successfully.",
            job_id: jobId,
            savedJob: savedJob.rows[0]
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "SAVE EXTERNAL JOB ERROR:",
            error
        );

        res.status(500).json({
            status: "error",

            // Temporary debugging so we can see
            // the actual PostgreSQL problem
            message: error.message,

            code:
                error.code ||
                null
        });

    } finally {

        client.release();
    }
};


module.exports = {
    searchExternalJobs,
    saveExternalJob
};