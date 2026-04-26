import { apiRequest } from "./api";

export async function getDashboardOverview() {
    return apiRequest("/api/admin/dashboard/overview");
}