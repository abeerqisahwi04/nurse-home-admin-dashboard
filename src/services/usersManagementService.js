import { apiRequest } from "./api";

const BASE_ENDPOINT = "/admin/users";

export async function getAdminUsers({
    type = "Patient",
    search = "",
    status = "All",
} = {}) {
    const params = new URLSearchParams();

    params.append("type", type);

    if (search.trim()) {
        params.append("search", search.trim());
    }

    if (status && status !== "All") {
        params.append("status", status);
    }

    return apiRequest(`${BASE_ENDPOINT}?${params.toString()}`);
}

export async function getAdminUserDetails(userId) {
    return apiRequest(`${BASE_ENDPOINT}/${userId}`);
}

export async function toggleAdminUserStatus(userId) {
    return apiRequest(`${BASE_ENDPOINT}/${userId}/toggle-status`, {
        method: "PUT",
    });
}

export async function resetAdminUserPassword(userId, newPassword) {
    return apiRequest(`${BASE_ENDPOINT}/${userId}/reset-password`, {
        method: "PUT",
        body: JSON.stringify({
            newPassword,
        }),
    });
}