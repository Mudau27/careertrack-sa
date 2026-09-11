const express = require("express");

const {
    searchExternalJobs
} = require(
    "../controllers/externalJobsController"
);

const protect = require(
    "../middleware/authMiddleware"
);

const router = express.Router();

router.get(
    "/search",
    protect,
    searchExternalJobs
);

module.exports = router;