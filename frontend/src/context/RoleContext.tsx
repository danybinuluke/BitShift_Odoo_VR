"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Role } from "@/config/rbac";
import { permissions } from "@/config/rbac";
import { getStoredUser, storeUser as persistUser } from "@/lib/authService";

/* ── Context shape ─────────────────────────────────────── */
interface RoleContextValue {
    role: Role;
    setRole: (r: Role) => void;
    perms: (typeof permissions)[Role];
    userName: string;
    userEmail: string;
}

const RoleContext = createContext<RoleContextValue | null>(null);

/* ── Provider ──────────────────────────────────────────── */
export function RoleProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<Role>("Manager");
    const [userName, setUserName] = useState("User");
    const [userEmail, setUserEmail] = useState("");

    // Hydrate from localStorage on mount
    useEffect(() => {
        const user = getStoredUser();
        if (user) {
            setRoleState(user.role);
            setUserName(user.name);
            setUserEmail(user.email);
        }
    }, []);

    const setRole = useCallback((r: Role) => {
        setRoleState(r);
        // Also persist the role change to localStorage
        const user = getStoredUser();
        if (user) {
            persistUser({ ...user, role: r });
        }
    }, []);

    const value: RoleContextValue = {
        role,
        setRole,
        perms: permissions[role],
        userName,
        userEmail,
    };

    return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

/* ── Hook ──────────────────────────────────────────────── */
export function useRole() {
    const ctx = useContext(RoleContext);
    if (!ctx) throw new Error("useRole must be used within <RoleProvider>");
    return ctx;
}
