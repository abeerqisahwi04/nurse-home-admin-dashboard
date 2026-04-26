import { apiRequest } from "./api";

const BASE_ENDPOINT = "/api/admin/complaints";

export async function getComplaints({ search = "", status = "All" } = {}) {
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search.trim());
    if (status && status !== "All") params.append("status", status);

    const query = params.toString();
    return apiRequest(query ? `${BASE_ENDPOINT}?${query}` : BASE_ENDPOINT);
}

export async function getComplaintDetails(id) {
    return apiRequest(`${BASE_ENDPOINT}/${id}`);
}

export async function sendComplaintResponse(id, adminResponse) {
    return apiRequest(`${BASE_ENDPOINT}/${id}/response`, {
        method: "PUT",
        body: JSON.stringify({ adminResponse }),
    });
}

export async function markComplaintResolved(id) {
    return apiRequest(`${BASE_ENDPOINT}/${id}/resolve`, {
        method: "PUT",
    });
}