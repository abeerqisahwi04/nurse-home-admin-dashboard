import { apiRequest } from "./api";

const BASE_ENDPOINT = "/admin/notifications";

export async function getAudienceCounts() {
    return apiRequest(`${BASE_ENDPOINT}/audience-counts`);
}

export async function sendAdminNotification({ targetAudience, title, message }) {
    return apiRequest(`${BASE_ENDPOINT}/send`, {
        method: "POST",
        body: JSON.stringify({
            targetAudience,
            title,
            message,
        }),
    });
}