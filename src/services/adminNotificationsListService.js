import { apiRequest } from "./api";

const BASE_ENDPOINT = "/api/admin/notifications-list";

export async function getAdminNotifications({
    search = "",
    type = "All",
    status = "All",
} = {}) {
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search.trim());
    if (type && type !== "All") params.append("type", type);
    if (status && status !== "All") params.append("status", status);

    const query = params.toString();

    return apiRequest(query ? `${BASE_ENDPOINT}?${query}` : BASE_ENDPOINT);
}

export async function markNotificationAsRead(id) {
    return apiRequest(`${BASE_ENDPOINT}/${id}/read`, {
        method: "PUT",
    });
}

export async function markAllNotificationsAsRead() {
    return apiRequest(`${BASE_ENDPOINT}/mark-all-read`, {
        method: "PUT",
    });
}

export async function deleteAdminNotification(id) {
    return apiRequest(`${BASE_ENDPOINT}/${id}`, {
        method: "DELETE",
    });
}