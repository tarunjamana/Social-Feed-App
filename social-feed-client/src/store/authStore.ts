import { create } from "zustand";
import type { AuthState } from "../types/auth";

const useAuthStore = create<AuthState>((set) => ({
  // state
  accessToken: null,
  user: null,
  // actions
  setAuth: (token, user) => set({ accessToken: token,user }),
  clearAuth: () => set({ accessToken: null, user: null }),
  updateUser: (user) => set((state) => ({ ...state, user })),
}));


export default useAuthStore