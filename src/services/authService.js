import { apiRequest, saveAdminToken, logoutAdmin } from "./api";

export async function loginAdmin(email, password) {
    const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (!data.token) {
        throw new Error("Token not returned");
    }

    const roles = data.roles || [];

    if (!roles.includes("Administrator")) {
        logoutAdmin();
        throw new Error("You are not allowed to access admin dashboard");
    }

    saveAdminToken(data.token);

    localStorage.setItem(
        "adminUser",
        JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            roles: data.roles,
        })
    );

    return data;
}

export function isAdminLoggedIn() {
    return !!localStorage.getItem("adminToken");
}