import { createNexaStore } from '../core/store';
import { signal } from '../core/signals';

// Auth state interface
interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Auth actions
const authActions = {
  login: (state: any, user: any) => {
    state.user.set(user);
    state.isAuthenticated.set(true);
    state.isLoading.set(false);
    state.error.set(null);
  },
  logout: (state: any) => {
    state.user.set(null);
    state.isAuthenticated.set(false);
    state.isLoading.set(false);
    state.error.set(null);
  },
  setLoading: (state: any, isLoading: boolean) => {
    state.isLoading.set(isLoading);
  },
  setError: (state: any, error: string | null) => {
    state.error.set(error);
    state.isLoading.set(false);
  },
  clearError: (state: any) => {
    state.error.set(null);
  }
};

// Create auth store
export const authStore = createNexaStore(initialAuthState, authActions);

// Signals for direct access
export const user = signal(initialAuthState.user);
export const isAuthenticated = signal(initialAuthState.isAuthenticated);
export const isLoading = signal(initialAuthState.isLoading);
export const error = signal(initialAuthState.error);

// Helper functions to update signals
export function login(newUser: any) {
  user.set(newUser);
  isAuthenticated.set(true);
  isLoading.set(false);
  error.set(null);
}

export function logout() {
  user.set(null);
  isAuthenticated.set(false);
  isLoading.set(false);
  error.set(null);
}

export function setLoading(loading: boolean) {
  isLoading.set(loading);
}

export function setError(err: string | null) {
  error.set(err);
  isLoading.set(false);
}

export function clearError() {
  error.set(null);
}
