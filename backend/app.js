const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const pool = require("./config/database");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const savedJobsRoutes = require("./routes/savedJobsRoutes");
const applicationsRoutes = require("./routes/applicationsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const externalJobsRoutes = require("./routes/externalJobsRoutes");
const interviewsRoutes = require("./routes/interviewsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cvAnalyzerRoutes = require("./routes/cvAnalyzerRoutes");


const app = express();


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
// API DOCUMENTATION
// ==========================================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(
        swaggerSpec,
        {
            customSiteTitle:
                "CareerTrack SA API Documentation"
        }
    )
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


// External Jobs

app.use(
    "/api/external-jobs",
    externalJobsRoutes
);


// CV Analyzer

app.use(
    "/api/cv-analyzer",
    cvAnalyzerRoutes
);


// ==========================================
// HEALTH CHECK
// ==========================================

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Checks whether the CareerTrack SA backend API is running.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Backend is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: CareerTrack SA backend is running!
 */

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

/**
 * @swagger
 * /api/db-test:
 *   get:
 *     summary: Test PostgreSQL connection
 *     description: Checks whether the CareerTrack SA backend can connect to PostgreSQL.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: PostgreSQL connection successful
 *       500:
 *         description: PostgreSQL connection failed
 */

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
// EXPORT EXPRESS APP
// ==========================================

module.exports = app;
