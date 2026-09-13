const pool = require("../config/database");

const createInterviewReminders = async () => {
    try {
        const result = await pool.query(`
            SELECT
                i.id AS interview_id,
                i.interview_date,
                a.user_id,
                j.title,
                j.company
            FROM interviews i
            INNER JOIN applications a
                ON i.application_id = a.id
            INNER JOIN jobs j
                ON a.job_id = j.id
            WHERE i.interview_date > NOW()
              AND i.interview_date <= NOW() + INTERVAL '25 hours'
            ORDER BY i.interview_date ASC
        `);

        for (const interview of result.rows) {
            const now = new Date();

            const interviewDate =
                new Date(interview.interview_date);

            const difference =
                interviewDate.getTime() -
                now.getTime();

            const hoursUntil =
                difference / (1000 * 60 * 60);

            let reminderType = null;
            let title = null;
            let message = null;

            // Around 24-hour reminder
            if (
                hoursUntil > 23 &&
                hoursUntil <= 25
            ) {
                reminderType =
                    "interview_24h";

                title =
                    "Interview Tomorrow";

                message =
                    `Your interview for ${interview.title} at ${interview.company} is tomorrow.`;
            }

            // Around 1-hour reminder
            else if (
                hoursUntil > 0 &&
                hoursUntil <= 1
            ) {
                reminderType =
                    "interview_1h";

                title =
                    "Interview Starting Soon";

                message =
                    `Your interview for ${interview.title} at ${interview.company} starts within 1 hour.`;
            }

            if (!reminderType) {
                continue;
            }

            // Prevent duplicate reminders
            const existing =
                await pool.query(
                    `
                    SELECT id
                    FROM notifications
                    WHERE user_id = $1
                      AND related_interview_id = $2
                      AND type = $3
                    LIMIT 1
                    `,
                    [
                        interview.user_id,
                        interview.interview_id,
                        reminderType
                    ]
                );

            if (
                existing.rows.length > 0
            ) {
                continue;
            }

            await pool.query(
                `
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message,
                    type,
                    related_interview_id
                )
                VALUES ($1, $2, $3, $4, $5)
                `,
                [
                    interview.user_id,
                    title,
                    message,
                    reminderType,
                    interview.interview_id
                ]
            );

            console.log(
                `Created ${reminderType} reminder for interview ${interview.interview_id}`
            );
        }
    } catch (error) {
        console.error(
            "Interview reminder error:",
            error
        );
    }
};

module.exports = {
    createInterviewReminders
};