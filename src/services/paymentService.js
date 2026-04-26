import { apiRequest } from "./api";

const BASE_ENDPOINT = "/admin/payments";

export async function getPaymentTransactions() {
    return apiRequest(BASE_ENDPOINT);
}