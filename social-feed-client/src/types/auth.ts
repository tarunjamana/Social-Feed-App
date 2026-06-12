import type { ReactNode } from 'react'

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export interface LoginMutationResult {
  login: {
    accessToken: string;
    user: User;
  };
}

export interface RegisterMutationResult {
  register: {
    accessToken: string;
    user: User;
  };
}

export interface ProtectedRouteProps  {
  children: ReactNode;
};