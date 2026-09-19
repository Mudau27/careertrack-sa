const express = require("express");

const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} = require("../controllers/notificationsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Returns all notifications belonging to the authenticated user, including the unread notification count.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error while retrieving notifications
 */
router.get(
    "/",
    protect,
    getNotifications
);


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     description: Marks all unread notifications belonging to the authenticated user as read.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error while updating notifications
 */
router.put(
    "/read-all",
    protect,
    markAllNotificationsAsRead
);


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     description: Marks a specific notification belonging to the authenticated user as read.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error while updating notification
 */
router.put(
    "/:id/read",
    protect,
    markNotificationAsRead
);


// ==========================================
// DELETE NOTIFICATION
// ==========================================

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     description: Deletes a specific notification belonging to the authenticated user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error while deleting notification
 */
router.delete(
    "/:id",
    protect,
    deleteNotification
);


module.exports = router;