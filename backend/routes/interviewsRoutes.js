const express = require("express");

const {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
} = require(
    "../controllers/interviewsController"
);

const protect = require(
    "../middleware/authMiddleware"
);

const router = express.Router();


// Create interview
router.post(
    "/",
    protect,
    createInterview
);


// Get all interviews
router.get(
    "/",
    protect,
    getInterviews
);


// Get one interview
router.get(
    "/:id",
    protect,
    getInterviewById
);


// Update interview
router.put(
    "/:id",
    protect,
    updateInterview
);


// Delete interview
router.delete(
    "/:id",
    protect,
    deleteInterview
);


module.exports = router;