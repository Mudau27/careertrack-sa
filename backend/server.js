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
const interviewsRoutes = require(
    "./routes/interviewsRoutes"
);


const app = express();

const PORT = 5000;


// Middleware
app.use(cors());
app.use(express.json());


// Make uploaded CV files accessible
app.use(
    "/uploads",
    express.static("uploads")
);


// Authentication routes
app.use(
    "/api/auth",
    authRoutes
);


// Profile routes
app.use(
    "/api/users",
    profileRoutes
);


// Jobs routes
app.use(
    "/api/jobs",
    jobsRoutes
);


// Saved jobs routes
app.use(
    "/api",
    savedJobsRoutes
);


// Applications routes
app.use(
    "/api/applications",
    applicationsRoutes
);

app.use(
    "/api/interviews",
    interviewsRoutes
);

// Dashboard routes
app.use(
    "/api/dashboard",
    dashboardRoutes
);


// External jobs routes
app.use(
    "/api/external-jobs",
    externalJobsRoutes
);


// API health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "CareerTrack SA backend is running!"
    });
});


// Database test
app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT NOW()"
        );

        res.json({
            status: "success",
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
            status: "error",
            message:
                "PostgreSQL connection failed."
        });
    }
});


app.listen(PORT, () => {
    console.log(
        `CareerTrack SA API running on http://localhost:${PORT}`
    );
});