import { create } from "zustand";

interface AuthState {
    accessToken: string | null;
    userId: string | null;
    initialized: boolean;
    setAuth: (token: string, userId: string) => void;
    logout: () => void;
    clearAuth: () => void;
    setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    userId: null,
    initialized: false,
    setAuth: (token, userId) => set({ accessToken: token, userId, initialized: true }),
    logout: () => set({ accessToken: null, userId: null, initialized: true }),
    setInitialized: () => set({ initialized: true }),
    clearAuth: () => set({ accessToken: null, userId: null }),
}));
