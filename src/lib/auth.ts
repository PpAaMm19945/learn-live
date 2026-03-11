import { create } from 'zustand';
import { Logger } from './Logger';

export type UserRole = 'parent' | 'learner';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    userId: string | null;
    email: string | null;
    name: string | null;
    roles: UserRole[];
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    email: null,
    name: null,
    roles: [],

    checkSession: async () => {
        set({ isLoading: true });
        try {
            const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
            const res = await fetch(`${apiUrl}/api/auth/me`, {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                set({
                    isAuthenticated: true,
                    isLoading: false,
                    userId: data.userId || null,
                    email: data.email || null,
                    name: data.name || null,
                    roles: data.roles || [],
                });
                Logger.info('[AUTH]', 'Session valid', { userId: data.userId });
            } else {
                set({
                    isAuthenticated: false,
                    isLoading: false,
                    userId: null,
                    email: null,
                    name: null,
                    roles: [],
                });
                Logger.info('[AUTH]', 'Session invalid or not found');
            }
        } catch (err) {
            Logger.error('[AUTH]', 'Session check failed', err);
            set({
                isAuthenticated: false,
                isLoading: false,
                userId: null,
                email: null,
                name: null,
                roles: [],
            });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
            await fetch(`${apiUrl}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            Logger.error('[AUTH]', 'Logout call failed', err);
        } finally {
            set({
                isAuthenticated: false,
                isLoading: false,
                userId: null,
                email: null,
                name: null,
                roles: [],
            });
            Logger.info('[AUTH]', 'User logged out');
        }
    },
}));
