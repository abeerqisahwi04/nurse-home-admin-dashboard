import { apiRequest } from "./api";

const BASE_ENDPOINT = "/api/admin/nurse-verification";

export async function getPendingNurses(search = "") {
    const params = new URLSearchParams();

    if (search) params.append("search", search);

    const queryString = params.toString();

    return apiRequest(
        queryString ? `${BASE_ENDPOINT}?${queryString}` : BASE_ENDPOINT
    );
}

export async function getNurseVerificationDetails(nurseProfileId) {
    return apiRequest(`${BASE_ENDPOINT}/${nurseProfileId}`);
}

export async function approveNurse(nurseProfileId) {
    return apiRequest(`${BASE_ENDPOINT}/${nurseProfileId}/approve`, {
        method: "PUT",
    });
}

export async function rejectNurse(nurseProfileId, rejectionReason) {
    return apiRequest(`${BASE_ENDPOINT}/${nurseProfileId}/reject`, {
        method: "PUT",
        body: JSON.stringify({ rejectionReason }),
    });
}