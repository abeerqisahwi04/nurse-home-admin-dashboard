const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

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

    const text = await response.text();

    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        if (response.status === 401) {
            logoutAdmin();
        }

        let message = "Request failed";

        if (data && typeof data === "object") {
            message = data.message || data.title || JSON.stringify(data);
        } else if (typeof data === "string" && data.trim()) {
            message = data;
        }

        throw new Error(message);
    }

    return data;
}