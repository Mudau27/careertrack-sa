const express = require("express");

const {
    analyzeUserCV
} = require("../controllers/cvAnalyzerController");

const protect = require(
    "../middleware/authMiddleware"
);

const router = express.Router();

router.post(
    "/analyze",
    protect,
    analyzeUserCV
);

module.exports = router;