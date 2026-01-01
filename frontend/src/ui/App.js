import { apiCall } from '../core/api.js';
import { STATE, UI_MESSAGES } from '../core/state.js';

export class App {
    constructor() {
        this.currentState = STATE.DISCONNECTED;
        this.selectedLocation = "br";

        // UI Elements
        this.btnMain = document.getElementById('btn-main');
        this.btnText = document.getElementById('btn-text');
        this.statusText = document.getElementById('status-text');
        this.statusSubtext = document.getElementById('status-subtext');
        this.errorToast = document.getElementById('error-toast');
        this.locationSelect = document.getElementById('location-select');

        this.setupEventListeners();
        this.startPolling();
    }

    log(msg) {
        console.log(`[App] ${msg}`);
    }

    setUIState(newState, message = "") {
        this.log(`State: ${this.currentState} -> ${newState}`);
        this.currentState = newState;

        this.btnMain.className = "";

        const config = UI_MESSAGES[newState] || UI_MESSAGES[STATE.ERROR];

        this.btnMain.classList.add(newState);
        this.btnText.innerText = config.btn;
        this.statusText.innerText = config.status;
        this.statusText.style.color = config.color;
        this.statusSubtext.innerText = config.sub;

        if (newState === STATE.ERROR) {
            this.showError(message);
            this.locationSelect.disabled = false;
        } else if (newState === STATE.CONNECTING) {
            this.locationSelect.disabled = true;
        } else if (newState === STATE.CONNECTED) {
            this.locationSelect.disabled = true;
        } else {
            this.locationSelect.disabled = false;
        }
    }

    showError(msg) {
        this.errorToast.innerText = msg;
        this.errorToast.classList.add("show");
        setTimeout(() => {
            this.errorToast.classList.remove("show");
        }, 5000);
    }

    async handleMainAction() {
        // Strict FSM
        if (this.currentState === STATE.CONNECTING) return;

        if (this.currentState === STATE.CONNECTED) {
            // Disconnect
            this.setUIState(STATE.CONNECTING);
            try {
                await apiCall("/disconnect", "POST");
                this.setUIState(STATE.DISCONNECTED);
            } catch (e) {
                this.setUIState(STATE.ERROR, "Erro ao desconectar");
            }
        } else {
            // Connect (from DISCONNECTED or ERROR)
            this.setUIState(STATE.CONNECTING);
            this.log(`Connecting to ${this.selectedLocation}...`);

            try {
                await apiCall("/connect", "POST");
                // Poll will update to CONNECTED
            } catch (e) {
                this.setUIState(STATE.ERROR, e.message);
            }
        }
    }

    async pollStatus() {
        // Don't poll if in ERROR or CONNECTING (user-controlled states)
        if (this.currentState === STATE.ERROR || this.currentState === STATE.CONNECTING) {
            return;
        }

        try {
            const data = await apiCall("/status");

            const targetState = data.active ? STATE.CONNECTED : STATE.DISCONNECTED;

            if (targetState !== this.currentState) {
                this.setUIState(targetState);
            }
        } catch (e) {
            console.warn("Poll failed:", e.message);
            // Don't set ERROR on poll failure - might be temporary
        }
    }

    setupEventListeners() {
        this.btnMain.onclick = () => this.handleMainAction();
        this.locationSelect.onchange = (e) => {
            this.selectedLocation = e.target.value;
            this.log(`Location: ${this.selectedLocation}`);
        };
    }

    startPolling() {
        this.pollStatus();
        setInterval(() => this.pollStatus(), 2000);
    }
}
