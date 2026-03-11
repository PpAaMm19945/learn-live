import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Logger } from './Logger';

export type UserRole = 'parent' | 'learner' | null;

interface AuthState {
    isAuthenticated: boolean;
    role: UserRole;
    familyId: string | null;
    userId: string | null;
    login: (role: UserRole, familyId: string, userId: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            role: null,
            familyId: null,
            userId: null,

            login: (role, familyId, userId) => {
                Logger.info('[AUTH]', `${role === 'parent' ? 'Parent' : 'Learner'} logged in`, { familyId, userId });
                set({ isAuthenticated: true, role, familyId, userId });
            },

            logout: () => {
                Logger.info('[AUTH]', 'User logged out');
                set({ isAuthenticated: false, role: null, familyId: null, userId: null });
            },
        }),
        {
            name: 'learnlive-auth',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
