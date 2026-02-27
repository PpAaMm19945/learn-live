import { create } from 'zustand';
import { Logger } from './Logger';

type ModalId = 'pin-entry' | 'confirm-logout' | 'network-warning' | null;

interface UIState {
    // ── Sidebar ───────────────────────────────────────────────────────────
    isSidebarOpen: boolean;
    toggleSidebar: () => void;

    // ── Network status ────────────────────────────────────────────────────
    isOffline: boolean;
    setOffline: (offline: boolean) => void;

    // ── Modal management ──────────────────────────────────────────────────
    activeModal: ModalId;
    openModal: (id: ModalId) => void;
    closeModal: () => void;

    // ── Active profile (shared-device) ────────────────────────────────────
    activeProfileId: string | null;
    activeProfileName: string | null;
    setActiveProfile: (id: string | null, name?: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    // Sidebar
    isSidebarOpen: false,
    toggleSidebar: () =>
        set((s) => {
            const next = !s.isSidebarOpen;
            Logger.info('[UI]', `Sidebar ${next ? 'opened' : 'closed'}`);
            return { isSidebarOpen: next };
        }),

    // Network
    isOffline: false,
    setOffline: (offline) => {
        Logger.warn('[UI]', `Network status: ${offline ? 'offline' : 'online'}`);
        set({ isOffline: offline });
    },

    // Modals
    activeModal: null,
    openModal: (id) => {
        Logger.info('[UI]', `Modal opened: ${id}`);
        set({ activeModal: id });
    },
    closeModal: () => set({ activeModal: null }),

    // Active profile
    activeProfileId: null,
    activeProfileName: null,
    setActiveProfile: (id, name = null) => {
        Logger.info('[UI]', `Active profile switched to: ${name ?? id ?? 'none'}`);
        set({ activeProfileId: id, activeProfileName: name });
    },
}));
