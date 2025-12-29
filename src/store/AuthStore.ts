import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "../api/auth";


export interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: (user, token) => {
        set({
          user,
          token,
        });
      },
      logout: () => {
        set({
          user: null,
          token: null,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
