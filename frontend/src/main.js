import { setToken } from './core/api.js';
import { App } from './ui/App.js';

async function fetchDesktopToken() {
    try {
        // Try to fetch from local Desktop token server
        const res = await fetch('http://localhost:17824/token', {
            method: 'GET',
            mode: 'cors'
        });

        if (res.ok) {
            const token = await res.text();
            console.log("[Desktop] Token fetched from local server");
            return token;
        }
    } catch (e) {
        // Not Desktop environment, return null
        console.log("[Web] Not in Desktop mode, using localStorage");
        return null;
    }
    return null;
}

async function init() {
    console.log("[Init] Starting LugoVPN...");

    // Try Desktop token first
    let token = await fetchDesktopToken();

    // If no Desktop token, check localStorage (Web mode)
    if (!token && typeof localStorage !== 'undefined') {
        token = localStorage.getItem('lugovpn_token');
        if (token) {
            console.log("[Web] Token loaded from localStorage");
        }
    }

    if (!token) {
        console.error("[Init] No token available");
        alert("Nenhum token de autenticação encontrado.\n\nDesktop: Token server não disponível\nWeb: Configure o token via localStorage");
        return;
    }

    setToken(token);
    console.log("[Init] Token configured successfully");

    // Mount app
    new App();
}

// Start
init();
