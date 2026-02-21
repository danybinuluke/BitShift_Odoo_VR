/* ─────────────────────────────────────────────────────────
 * FleetFlow – Auth Service (frontend-only mock)
 *
 * ⚠️  Replace mock logic with real API calls later.
 *     All auth state lives in localStorage.
 * ────────────────────────────────────────────────────── */

import { login as apiLogin, register as apiRegister } from "./api";
import type { Role } from "@/config/rbac";

const STORAGE_KEY = "fleetflow_user";
const TOKEN_KEY = "fleetflow_token";

export interface AuthUser {
    name: string;
    email: string;
    role: Role;
    token?: string;
}

/* ── Read ──────────────────────────────────────────────── */
export function getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

/* ── Write ─────────────────────────────────────────────── */
export function storeUser(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    if (user.token) {
        localStorage.setItem(TOKEN_KEY, user.token);
    }
}

/* ── Clear ─────────────────────────────────────────────── */
export function clearUser(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
}

/* ── Login ─────────────────────────────────────────────── */
export async function login(email: string, password: string): Promise<AuthUser> {
    const response = await apiLogin({ email, password });

    // Assume response is { user: { name, email, role }, token }
    const user: AuthUser = {
        ...response.user,
        token: response.token,
    };

    storeUser(user);
    return user;
}

/* ── Signup ────────────────────────────────────────────── */
export async function signup(
    name: string,
    email: string,
    password: string,
    role: Role
): Promise<AuthUser> {
    const response = await apiRegister({ name, email, password, role });

    const user: AuthUser = {
        ...response.user,
        token: response.token,
    };

    storeUser(user);
    return user;
}

/* ── Logout ────────────────────────────────────────────── */
export function logout(): void {
    clearUser();
}
