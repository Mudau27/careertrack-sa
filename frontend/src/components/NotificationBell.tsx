import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  CalendarDays,
} from "lucide-react";

import api from "../services/api";

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_interview_id: number | null;
  created_at: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/notifications");

      setNotifications(
        response.data.notifications || []
      );

      setUnreadCount(
        response.data.unread_count || 0
      );
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ==========================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const markAsRead = async (
    notification: Notification
  ) => {
    if (notification.is_read) {
      return;
    }

    try {
      await api.put(
        `/notifications/${notification.id}/read`
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                is_read: true,
              }
            : item
        )
      );

      setUnreadCount((count) =>
        Math.max(0, count - 1)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      await api.put(
        "/notifications/read-all"
      );

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  const deleteNotification = async (
    id: number
  ) => {
    try {
      const notification =
        notifications.find(
          (item) => item.id === id
        );

      await api.delete(
        `/notifications/${id}`
      );

      setNotifications((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );

      if (
        notification &&
        !notification.is_read
      ) {
        setUnreadCount((count) =>
          Math.max(0, count - 1)
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (
    createdAt: string
  ) => {
    const date =
      new Date(createdAt);

    return date.toLocaleString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // OPEN / CLOSE
  // ==========================================

  const toggleNotifications = () => {
    setOpen((current) => !current);

    if (!open) {
      fetchNotifications();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* Bell */}

      <button
        onClick={toggleNotifications}
        className="relative w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
        title="Notifications"
      >
        <Bell
          size={22}
          style={{
            color: "#374151",
          }}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}

      {open && (
        <div className="absolute right-0 mt-3 w-[380px] max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

          {/* Dropdown Header */}

          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-4">

            <div>
              <h3
                className="text-lg font-bold"
                style={{
                  color: "#111827",
                }}
              >
                Notifications
              </h3>

              <p
                className="text-xs mt-1"
                style={{
                  color: "#6b7280",
                }}
              >
                {unreadCount === 0
                  ? "You're all caught up"
                  : `${unreadCount} unread notification${
                      unreadCount === 1
                        ? ""
                        : "s"
                    }`}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={
                  markAllAsRead
                }
                className="flex items-center gap-1 text-sm font-semibold hover:underline"
                style={{
                  color: "#2563eb",
                }}
              >
                <CheckCheck
                  size={16}
                />

                Mark all read
              </button>
            )}

          </div>

          {/* Notification List */}

          <div className="max-h-[430px] overflow-y-auto">

            {loading &&
            notifications.length === 0 ? (
              <div className="p-8 text-center">

                <p
                  style={{
                    color: "#6b7280",
                  }}
                >
                  Loading notifications...
                </p>

              </div>
            ) : notifications.length >
              0 ? (
              notifications.map(
                (notification) => (
                  <div
                    key={
                      notification.id
                    }
                    onClick={() =>
                      markAsRead(
                        notification
                      )
                    }
                    className={`relative px-5 py-4 border-b border-gray-100 cursor-pointer transition ${
                      notification.is_read
                        ? "bg-white hover:bg-gray-50"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >

                    <div className="flex gap-3">

                      <div className="shrink-0 mt-1">

                        <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">

                          <CalendarDays
                            size={18}
                            className="text-purple-600"
                          />

                        </div>

                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <div className="flex items-center gap-2">

                              <h4
                                className="font-bold text-sm"
                                style={{
                                  color:
                                    "#111827",
                                }}
                              >
                                {
                                  notification.title
                                }
                              </h4>

                              {!notification.is_read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                              )}

                            </div>

                            <p
                              className="text-sm mt-1 leading-5"
                              style={{
                                color:
                                  "#374151",
                              }}
                            >
                              {
                                notification.message
                              }
                            </p>

                            <p
                              className="text-xs mt-2"
                              style={{
                                color:
                                  "#6b7280",
                              }}
                            >
                              {formatDate(
                                notification.created_at
                              )}
                            </p>

                          </div>

                          <button
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              deleteNotification(
                                notification.id
                              );
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-100 transition shrink-0"
                            title="Delete notification"
                          >
                            <Trash2
                              size={16}
                              className="text-red-500"
                            />
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              )
            ) : (
              <div className="p-10 text-center">

                <Bell
                  size={32}
                  className="mx-auto text-gray-400"
                />

                <h4
                  className="font-semibold mt-3"
                  style={{
                    color: "#111827",
                  }}
                >
                  No notifications
                </h4>

                <p
                  className="text-sm mt-1"
                  style={{
                    color: "#6b7280",
                  }}
                >
                  New interview notifications will appear here.
                </p>

              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationBell;