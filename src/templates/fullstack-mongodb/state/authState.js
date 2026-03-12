import { signal } from '../core/signals.js';

export const user = signal(null);
export const isAuthenticated = signal(false);
export const isLoading = signal(false);
export const error = signal(null);

export function login(userData) {
    user.set(userData);
    isAuthenticated.set(true);
    error.set(null);
}

export function logout() {
    user.set(null);
    isAuthenticated.set(false);
    error.set(null);
}

export function setLoading(loading) {
    isLoading.set(loading);
}

export function setError(err) {
    error.set(err);
}

export function clearError() {
    error.set(null);
}