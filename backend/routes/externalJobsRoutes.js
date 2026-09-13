const express = require("express");

const {
    searchExternalJobs,
    saveExternalJob
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

router.post(
    "/save",
    protect,
    saveExternalJob
);

module.exports = router;