const express = require("express");

const {
    saveJob,
    removeSavedJob,
    getSavedJobs
} = require("../controllers/savedJobsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Save a job
router.post("/jobs/:id/save", protect, saveJob);

// Remove a saved job
router.delete("/jobs/:id/save", protect, removeSavedJob);

// Get user's saved jobs
router.get("/users/saved-jobs", protect, getSavedJobs);

module.exports = router;