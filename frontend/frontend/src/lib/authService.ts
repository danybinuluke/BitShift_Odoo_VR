/* ─────────────────────────────────────────────────────────
 * FleetFlow – Auth Service (frontend-only mock)
 *
 * ⚠️  Replace mock logic with real API calls later.
 *     All auth state lives in localStorage.
 * ────────────────────────────────────────────────────── */

import type { Role } from "@/config/rbac";

const STORAGE_KEY = "fleetflow_user";

export interface AuthUser {
    name: string;
    email: string;
    role: Role;
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
}

/* ── Clear ─────────────────────────────────────────────── */
export function clearUser(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/* ── Mock login ────────────────────────────────────────── */
export async function mockLogin(email: string, _password: string): Promise<AuthUser> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    // In a real app: POST /api/auth/login
    // For now, return a mock Manager user
    const user: AuthUser = {
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        role: "Manager",
    };
    storeUser(user);
    return user;
}

/* ── Mock signup ───────────────────────────────────────── */
export async function mockSignup(
    name: string,
    email: string,
    _password: string,
    role: Role
): Promise<AuthUser> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    // In a real app: POST /api/auth/signup
    const user: AuthUser = { name, email, role };
    storeUser(user);
    return user;
}

/* ── Logout ────────────────────────────────────────────── */
export function logout(): void {
    clearUser();
}
