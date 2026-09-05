const express = require("express");

const {
    getDashboardStatistics
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/statistics", protect, getDashboardStatistics);

module.exports = router;