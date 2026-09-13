const pool = require("../config/database");

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                id,
                user_id,
                title,
                message,
                type,
                is_read,
                related_interview_id,
                created_at
             FROM notifications
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        const unreadResult = await pool.query(
            `SELECT COUNT(*)::int AS unread_count
             FROM notifications
             WHERE user_id = $1
             AND is_read = FALSE`,
            [userId]
        );

        res.json({
            status: "success",
            unread_count:
                unreadResult.rows[0].unread_count,
            notifications: result.rows
        });

    } catch (error) {
        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while retrieving notifications."
        });
    }
};

const markNotificationAsRead = async (
    req,
    res
) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [id, userId]
        );

        if (
            result.rows.length === 0
        ) {
            return res.status(404).json({
                status: "error",
                message:
                    "Notification not found."
            });
        }

        res.json({
            status: "success",
            message:
                "Notification marked as read.",
            notification:
                result.rows[0]
        });

    } catch (error) {
        console.error(
            "Mark notification error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while updating notification."
        });
    }
};

const markAllNotificationsAsRead =
    async (req, res) => {
        try {
            const userId =
                req.user.id;

            await pool.query(
                `UPDATE notifications
                 SET is_read = TRUE
                 WHERE user_id = $1
                 AND is_read = FALSE`,
                [userId]
            );

            res.json({
                status: "success",
                message:
                    "All notifications marked as read."
            });

        } catch (error) {
            console.error(
                "Mark all notifications error:",
                error
            );

            res.status(500).json({
                status: "error",
                message:
                    "Server error while updating notifications."
            });
        }
    };

const deleteNotification = async (
    req,
    res
) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result =
            await pool.query(
                `DELETE FROM notifications
                 WHERE id = $1
                 AND user_id = $2
                 RETURNING *`,
                [id, userId]
            );

        if (
            result.rows.length === 0
        ) {
            return res.status(404).json({
                status: "error",
                message:
                    "Notification not found."
            });
        }

        res.json({
            status: "success",
            message:
                "Notification deleted successfully."
        });

    } catch (error) {
        console.error(
            "Delete notification error:",
            error
        );

        res.status(500).json({
            status: "error",
            message:
                "Server error while deleting notification."
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};