import { apiRequest } from "./api";

export async function getDashboardOverview() {
    return apiRequest("/admin/dashboard/overview");
}