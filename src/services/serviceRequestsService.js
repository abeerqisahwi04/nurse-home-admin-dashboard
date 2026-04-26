import { apiRequest } from "./api";

const BASE_ENDPOINT = "/api/admin/service-requests";

export async function getServiceRequests({ search = "", status = "All" } = {}) {
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search.trim());
    if (status && status !== "All") params.append("status", status);

    const query = params.toString();

    return apiRequest(query ? `${BASE_ENDPOINT}?${query}` : BASE_ENDPOINT);
}

export async function getServiceRequestDetails(requestId) {
    return apiRequest(`${BASE_ENDPOINT}/${requestId}`);
}