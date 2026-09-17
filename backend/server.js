const express = require("express");
const cors = require("cors");

const pool = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const savedJobsRoutes = require("./routes/savedJobsRoutes");
const applicationsRoutes = require("./routes/applicationsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const externalJobsRoutes = require("./routes/externalJobsRoutes");
const interviewsRoutes = require("./routes/interviewsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const adminRoutes =
    require("./routes/adminRoutes");

const {
    createInterviewReminders
} = require("./services/interviewReminderService");


const app = express();

const PORT = 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// Make uploaded CV files accessible

app.use(
    "/uploads",
    express.static("uploads")
);


// ==========================================
// ROUTES
// ==========================================


// Authentication

app.use(
    "/api/auth",
    authRoutes
);


// Profile

app.use(
    "/api/users",
    profileRoutes
);


// Jobs

app.use(
    "/api/jobs",
    jobsRoutes
);


// Saved Jobs

app.use(
    "/api",
    savedJobsRoutes
);


// Applications

app.use(
    "/api/applications",
    applicationsRoutes
);


// Interviews

app.use(
    "/api/interviews",
    interviewsRoutes
);


// Notifications

app.use(
    "/api/notifications",
    notificationsRoutes
);


// Dashboard

app.use(
    "/api/dashboard",
    dashboardRoutes
);


// Admin

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/external-jobs",
    externalJobsRoutes
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({
            status: "success",
            message:
                "CareerTrack SA backend is running!"
        });

    }
);


// ==========================================
// DATABASE TEST
// ==========================================

app.get(
    "/api/db-test",
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    "SELECT NOW()"
                );


            res.json({

                status:
                    "success",

                message:
                    "PostgreSQL connection successful!",

                database_time:
                    result.rows[0].now

            });


        } catch (error) {

            console.error(
                "Database connection error:",
                error.message
            );


            res.status(500).json({

                status:
                    "error",

                message:
                    "PostgreSQL connection failed."

            });

        }

    }
);


// ==========================================
// AUTOMATIC INTERVIEW REMINDERS
// ==========================================


// Check every 5 minutes

const REMINDER_INTERVAL =
    5 * 60 * 1000;


// Run once when backend starts

createInterviewReminders();


// Then check every 5 minutes

setInterval(
    createInterviewReminders,
    REMINDER_INTERVAL
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `CareerTrack SA API running on http://localhost:${PORT}`
        );

        console.log(
            "Interview reminder service is running."
        );

    }
);