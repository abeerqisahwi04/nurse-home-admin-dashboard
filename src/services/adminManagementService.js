import { apiRequest } from "./api";

const BASE_ENDPOINT = "/api/admin/management";

export async function getAdmins() {
    return apiRequest(BASE_ENDPOINT);
}

export async function createAdmin({ fullName, email, password }) {
    return apiRequest(BASE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
    });
}

export async function deleteAdmin(adminId) {
    return apiRequest(`${BASE_ENDPOINT}/${adminId}`, {
        method: "DELETE",
    });
}