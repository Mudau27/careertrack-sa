const express = require("express");

const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} = require(
    "../controllers/notificationsController"
);

const protect = require(
    "../middleware/authMiddleware"
);

const router =
    express.Router();

router.get(
    "/",
    protect,
    getNotifications
);

router.put(
    "/read-all",
    protect,
    markAllNotificationsAsRead
);

router.put(
    "/:id/read",
    protect,
    markNotificationAsRead
);

router.delete(
    "/:id",
    protect,
    deleteNotification
);

module.exports = router;