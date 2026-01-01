export const STATE = {
    DISCONNECTED: "disconnected",
    CONNECTING: "connecting",
    CONNECTED: "connected",
    ERROR: "error"
};

export const UI_MESSAGES = {
    [STATE.DISCONNECTED]: {
        btn: "CONECTAR",
        status: "Desconectado",
        sub: "Sua conexão não está protegida",
        color: "#9CA3AF"
    },
    [STATE.CONNECTING]: {
        btn: "...",
        status: "Conectando...",
        sub: "Negociando chaves...",
        color: "#FCD34D"
    },
    [STATE.CONNECTED]: {
        btn: "DESCONECTAR",
        status: "Protegido",
        sub: "VPN Ativa e Segura",
        color: "#22C55E"
    },
    [STATE.ERROR]: {
        btn: "TENTAR NOVAMENTE",
        status: "Erro de Conexão",
        sub: "Verifique se o daemon está rodando",
        color: "#EF4444"
    }
};
