import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAdminNotification,
} from "../../services/adminNotificationsListService";

export default function ViewAllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [deleting, setDeleting] = useState(false);

  // Fetch notifications on component mount and when filters change
  useEffect(() => {
    fetchNotifications();
  }, [filterType, filterStatus]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminNotifications({
        search: "",
        type: filterType,
        status: filterStatus,
      });
      setNotifications(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter notifications locally for search
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif,
        ),
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAsUnread = async (id) => {
    // Note: API may not have unread endpoint, this is local state update
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: false } : notif,
      ),
    );
  };

  const deleteNotification = async (id) => {
    try {
      await deleteAdminNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setSelectedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const deleteSelected = async () => {
    try {
      setDeleting(true);
      await Promise.all(
        Array.from(selectedNotifications).map((id) =>
          deleteAdminNotification(id),
        ),
      );
      setNotifications((prev) =>
        prev.filter((notif) => !selectedNotifications.has(notif.id)),
      );
      setSelectedNotifications(new Set());
    } catch (err) {
      console.error("Error deleting notifications:", err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleNotification = (id) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAllNotifications = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      const allIds = new Set(filteredNotifications.map((n) => n.id));
      setSelectedNotifications(allIds);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      verification: "bg-blue-100 text-blue-700 border-blue-200",
      payment: "bg-green-100 text-green-700 border-green-200",
      complaint: "bg-red-100 text-red-700 border-red-200",
      booking: "bg-purple-100 text-purple-700 border-purple-200",
      system: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getTypeLabel = (type) => {
    const labels = {
      verification: "Verification",
      payment: "Payment",
      complaint: "Complaint",
      booking: "Booking",
      system: "System",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredNotifications.length} notification(s) • {unreadCount}{" "}
            unread
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter by Type */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="verification">Verification</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="complaint">Complaint</SelectItem>
              <SelectItem value="booking">Booking</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Status */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>

          {/* Delete Selected */}
          {selectedNotifications.size > 0 && (
            <Button
              onClick={deleteSelected}
              disabled={deleting}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              {deleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete ({selectedNotifications.size})
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <Button
              onClick={fetchNotifications}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Select All Header */}
            <div className="px-6 py-3 bg-gray-50 flex items-center gap-3 border-b border-gray-200">
              <input
                type="checkbox"
                checked={
                  selectedNotifications.size === filteredNotifications.length &&
                  filteredNotifications.length > 0
                }
                onChange={toggleAllNotifications}
                className="rounded cursor-pointer w-4 h-4"
              />
              <span className="text-sm text-gray-600">
                {selectedNotifications.size > 0
                  ? `${selectedNotifications.size} selected`
                  : "Select notifications"}
              </span>
            </div>

            {/* Notifications */}
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4 ${
                  !notification.isRead ? "bg-blue-50/20" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedNotifications.has(notification.id)}
                  onChange={() => toggleNotification(notification.id)}
                  className="rounded cursor-pointer w-4 h-4 mt-1 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${getTypeColor(
                          notification.type,
                        )}`}
                      >
                        <Bell className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full border ${getTypeColor(
                              notification.type,
                            )}`}
                          >
                            {getTypeLabel(notification.type)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#1F7A8C] rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.isRead ? (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-gray-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsUnread(notification.id)}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Mark as unread"
                        >
                          <EyeOff className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
