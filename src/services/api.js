const API_BASE_URL = "https://localhost:7053";

export function getAdminToken() {
    return localStorage.getItem("adminToken");
}

export function saveAdminToken(token) {
    localStorage.setItem("adminToken", token);
}

export function logoutAdmin() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
}

export async function apiRequest(endpoint, options = {}) {
    const token = getAdminToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Request failed");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}