"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { logout } from "@/lib/authService";
import type { Role } from "@/config/rbac";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/vehicles": "Vehicle Registry",
    "/drivers": "Driver Management",
    "/dispatcher": "Trip Dispatcher",
    "/maintenance": "Maintenance Logs",
    "/analytics": "Operational Analytics",
};

const allRoles: Role[] = ["Manager", "Dispatcher", "Safety", "Financial"];

export default function Topbar() {
    const pathname = usePathname();
    const router = useRouter();
    const title = pageTitles[pathname] || "Dashboard";
    const { role, setRole, userName } = useRole();

    const handleLogout = () => {
        logout();
        router.push("/auth");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <h1 className="text-xl font-semibold text-gray-900 pl-12">{title}</h1>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                        {userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-800 leading-tight">
                            {userName}
                        </p>
                        <div className="flex items-center gap-1">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as Role)}
                                className="text-xs text-gray-500 bg-transparent border-0 outline-none cursor-pointer p-0"
                            >
                                {allRoles.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-100">
                        {role}
                    </span>
                </div>

                <div className="h-6 w-px bg-gray-200" />

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Logout"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}
