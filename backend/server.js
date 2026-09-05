const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const savedJobsRoutes = require("./routes/savedJobsRoutes");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api", savedJobsRoutes);

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
        const result = await pool.query("SELECT NOW()");

        res.json({
            status: "success",
            message: "PostgreSQL connection successful!",
            database_time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            status: "error",
            message: "PostgreSQL connection failed."
        });
    }
});

app.listen(PORT, () => {
    console.log(`CareerTrack SA API running on http://localhost:${PORT}`);
});