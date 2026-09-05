const express = require("express");

const {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
} = require("../controllers/applicationsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create application
router.post("/", protect, createApplication);

// Get all applications for logged-in user
router.get("/", protect, getApplications);

// Get one application
router.get("/:id", protect, getApplicationById);

// Update application
router.put("/:id", protect, updateApplication);

// Delete application
router.delete("/:id", protect, deleteApplication);

module.exports = router;