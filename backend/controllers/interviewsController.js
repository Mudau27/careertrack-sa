const pool = require("../config/database");


// ==========================================
// HELPER - FORMAT INTERVIEW DATE
// ==========================================

const formatInterviewDate = (date) => {
    try {
        return new Date(date).toLocaleString(
            "en-ZA",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    } catch {
        return date;
    }
};


// ==========================================
// CREATE INTERVIEW
// ==========================================

const createInterview = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const userId = req.user.id;

        const {
            application_id,
            interview_date,
            interview_type,
            location,
            notes
        } = req.body;


        // -----------------------------
        // Validation
        // -----------------------------

        if (!application_id) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                status: "error",
                message: "Application ID is required."
            });
        }


        if (!interview_date) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                status: "error",
                message: "Interview date is required."
            });
        }


        // -----------------------------
        // Check application ownership
        // Also get job information
        // -----------------------------

        const application = await client.query(
            `
            SELECT
                a.id,
                j.title,
                j.company

            FROM applications a

            INNER JOIN jobs j
                ON a.job_id = j.id

            WHERE a.id = $1
            AND a.user_id = $2
            `,
            [
                application_id,
                userId
            ]
        );


        if (application.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                status: "error",
                message: "Application not found."
            });
        }


        const applicationData = application.rows[0];


        // -----------------------------
        // Check duplicate interview
        // -----------------------------

        const existingInterview = await client.query(
            `
            SELECT id

            FROM interviews

            WHERE application_id = $1
            `,
            [
                application_id
            ]
        );


        if (existingInterview.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                status: "error",
                message:
                    "An interview is already scheduled for this application."
            });
        }


        // -----------------------------
        // Create interview
        // -----------------------------

        const result = await client.query(
            `
            INSERT INTO interviews
            (
                application_id,
                interview_date,
                interview_type,
                location,
                notes
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )

            RETURNING *
            `,
            [
                application_id,
                interview_date,
                interview_type || null,
                location || null,
                notes || null
            ]
        );


        const newInterview = result.rows[0];


        // -----------------------------
        // Update application status
        // -----------------------------

        await client.query(
            `
            UPDATE applications

            SET status = 'Interview'

            WHERE id = $1
            AND user_id = $2
            `,
            [
                application_id,
                userId
            ]
        );


        // -----------------------------
        // Create notification
        // -----------------------------

        const formattedDate = formatInterviewDate(
            interview_date
        );


        await client.query(
            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message,
                type,
                related_interview_id
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            `,
            [
                userId,

                "Interview Scheduled",

                `Your interview for ${applicationData.title} at ${applicationData.company} is scheduled for ${formattedDate}.`,

                "interview",

                newInterview.id
            ]
        );


        // -----------------------------
        // Commit transaction
        // -----------------------------

        await client.query("COMMIT");


        res.status(201).json({
            status: "success",
            message: "Interview scheduled successfully.",
            interview: newInterview
        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Create interview error:",
            error
        );


        res.status(500).json({
            status: "error",
            message:
                "Server error while scheduling interview."
        });

    } finally {

        client.release();
    }
};


// ==========================================
// GET ALL INTERVIEWS
// ==========================================

const getInterviews = async (req, res) => {

    try {

        const userId = req.user.id;


        const result = await pool.query(
            `
            SELECT

                i.id,

                i.application_id,

                i.interview_date,

                i.interview_type,

                i.location,

                i.notes,

                i.created_at,


                a.status,


                j.id AS job_id,

                j.title,

                j.company,

                j.location AS job_location


            FROM interviews i


            INNER JOIN applications a

                ON i.application_id = a.id


            INNER JOIN jobs j

                ON a.job_id = j.id


            WHERE a.user_id = $1


            ORDER BY
                i.interview_date ASC
            `,
            [
                userId
            ]
        );


        res.json({
            status: "success",
            count: result.rows.length,
            interviews: result.rows
        });


    } catch (error) {

        console.error(
            "Get interviews error:",
            error
        );


        res.status(500).json({
            status: "error",
            message:
                "Server error while retrieving interviews."
        });
    }
};


// ==========================================
// GET ONE INTERVIEW
// ==========================================

const getInterviewById = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            id
        } = req.params;


        const result = await pool.query(
            `
            SELECT

                i.id,

                i.application_id,

                i.interview_date,

                i.interview_type,

                i.location,

                i.notes,

                i.created_at,


                a.status,


                j.id AS job_id,

                j.title,

                j.company,

                j.location AS job_location


            FROM interviews i


            INNER JOIN applications a

                ON i.application_id = a.id


            INNER JOIN jobs j

                ON a.job_id = j.id


            WHERE i.id = $1

            AND a.user_id = $2
            `,
            [
                id,
                userId
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                status: "error",
                message: "Interview not found."
            });
        }


        res.json({
            status: "success",
            interview: result.rows[0]
        });


    } catch (error) {

        console.error(
            "Get interview error:",
            error
        );


        res.status(500).json({
            status: "error",
            message:
                "Server error while retrieving interview."
        });
    }
};


// ==========================================
// UPDATE INTERVIEW
// ==========================================

const updateInterview = async (req, res) => {

    const client = await pool.connect();


    try {

        await client.query("BEGIN");


        const userId = req.user.id;

        const {
            id
        } = req.params;


        const {
            interview_date,
            interview_type,
            location,
            notes
        } = req.body;


        // -----------------------------
        // Check interview ownership
        // -----------------------------

        const interviewCheck = await client.query(
            `
            SELECT

                i.id,

                i.interview_date,

                j.title,

                j.company


            FROM interviews i


            INNER JOIN applications a

                ON i.application_id = a.id


            INNER JOIN jobs j

                ON a.job_id = j.id


            WHERE i.id = $1

            AND a.user_id = $2
            `,
            [
                id,
                userId
            ]
        );


        if (interviewCheck.rows.length === 0) {

            await client.query("ROLLBACK");


            return res.status(404).json({
                status: "error",
                message: "Interview not found."
            });
        }


        const interviewData =
            interviewCheck.rows[0];


        // -----------------------------
        // Update interview
        // -----------------------------

        const result = await client.query(
            `
            UPDATE interviews

            SET

                interview_date =
                    COALESCE(
                        $1,
                        interview_date
                    ),

                interview_type =
                    COALESCE(
                        $2,
                        interview_type
                    ),

                location =
                    COALESCE(
                        $3,
                        location
                    ),

                notes =
                    COALESCE(
                        $4,
                        notes
                    )


            WHERE id = $5


            RETURNING *
            `,
            [
                interview_date || null,

                interview_type || null,

                location || null,

                notes || null,

                id
            ]
        );


        const updatedInterview =
            result.rows[0];


        // -----------------------------
        // Create notification
        // -----------------------------

        const formattedDate =
            formatInterviewDate(
                updatedInterview.interview_date
            );


        await client.query(
            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message,
                type,
                related_interview_id
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            `,
            [
                userId,

                "Interview Updated",

                `Your interview for ${interviewData.title} at ${interviewData.company} has been updated. It is scheduled for ${formattedDate}.`,

                "interview",

                id
            ]
        );


        await client.query("COMMIT");


        res.json({
            status: "success",
            message:
                "Interview updated successfully.",
            interview: updatedInterview
        });


    } catch (error) {

        await client.query("ROLLBACK");


        console.error(
            "Update interview error:",
            error
        );


        res.status(500).json({
            status: "error",
            message:
                "Server error while updating interview."
        });


    } finally {

        client.release();
    }
};


// ==========================================
// DELETE INTERVIEW
// ==========================================

const deleteInterview = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            id
        } = req.params;


        const result = await pool.query(
            `
            DELETE FROM interviews


            WHERE id IN
            (
                SELECT i.id

                FROM interviews i


                INNER JOIN applications a

                    ON i.application_id = a.id


                WHERE i.id = $1

                AND a.user_id = $2
            )


            RETURNING *
            `,
            [
                id,
                userId
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                status: "error",
                message: "Interview not found."
            });
        }


        res.json({
            status: "success",
            message:
                "Interview deleted successfully."
        });


    } catch (error) {

        console.error(
            "Delete interview error:",
            error
        );


        res.status(500).json({
            status: "error",
            message:
                "Server error while deleting interview."
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
};