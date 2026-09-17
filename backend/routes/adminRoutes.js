const express = require("express");

const {
    getAdminStatistics,
    getUsers,
    updateUserRole,
    deleteUser,
    getJobs,
    deleteJob,
    getApplications
} = require(
    "../controllers/adminController"
);

const protect = require(
    "../middleware/authMiddleware"
);

const adminOnly = require(
    "../middleware/adminMiddleware"
);

const router =
    express.Router();


// Every route below requires:
// 1. Valid JWT
// 2. Admin role

router.use(
    protect,
    adminOnly
);


// Dashboard statistics

router.get(
    "/statistics",
    getAdminStatistics
);


// Users

router.get(
    "/users",
    getUsers
);

router.put(
    "/users/:id/role",
    updateUserRole
);

router.delete(
    "/users/:id",
    deleteUser
);


// Jobs

router.get(
    "/jobs",
    getJobs
);

router.delete(
    "/jobs/:id",
    deleteJob
);


// Applications

router.get(
    "/applications",
    getApplications
);


module.exports = router;