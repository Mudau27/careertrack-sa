const express = require("express");

const {
    getJobs,
    getJobById,
    createJob
} = require("../controllers/jobsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getJobs);

router.get("/:id", getJobById);

router.post("/", protect, createJob);

module.exports = router;