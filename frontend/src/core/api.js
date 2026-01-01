// Pure HTTP API - Works in both Web and Desktop
const API_URL = "http://localhost:17823";

// Token management (environment-agnostic)
let authToken = "";

export function setToken(token) {
    console.log(`[API] setToken called with: ${token.substring(0, 20)}...`);
    authToken = token;
    // Persist for web environment
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lugovpn_token', token);
    }
}

export function getToken() {
    if (authToken) return authToken;

    // Try to load from localStorage (web)
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('lugovpn_token');
        if (stored) {
            authToken = stored;
            return stored;
        }
    }

    return "";
}

export async function apiCall(endpoint, method = "GET") {
    const token = getToken();
    if (!token) {
        console.error("[API] No auth token available");
        throw new Error("No auth token");
    }

    console.log(`[API] ${method} ${endpoint}`);
    console.log(`[API] Token: ${token.substring(0, 20)}...${token.substring(token.length - 10)}`);

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log(`[API] Response: ${res.status} ${res.statusText}`);

        if (res.status === 401) {
            const text = await res.text();
            console.error(`[API] 401 Unauthorized: ${text}`);
            throw new Error(`Unauthorized: ${text}`);
        }

        if (!res.ok) {
            const text = await res.text();
            console.error(`[API] Error ${res.status}: ${text}`);
            throw new Error(text || `Server Error: ${res.status}`);
        }

        const data = await res.json();
        console.log(`[API] Success:`, data);
        return data;
    } catch (e) {
        if (e.message.includes("Failed to fetch")) {
            console.error("[API] Network error - daemon unavailable");
            throw new Error("Daemon unavailable");
        }
        console.error("[API] Exception:", e.message);
        throw e;
    }
}
