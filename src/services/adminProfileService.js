import { apiRequest } from "./api";

const BASE_ENDPOINT = "/api/admin/profile";

export async function getAdminProfile() {
    return apiRequest(BASE_ENDPOINT);
}

export async function updateAdminProfile(data) {
    return apiRequest(BASE_ENDPOINT, {
        method: "PUT",
        body: JSON.stringify({
            fullName: data.fullName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        }),
    });
}