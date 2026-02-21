"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, LogOut } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { logout } from "@/lib/authService";
import type { Role } from "@/config/rbac";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/vehicles": "Vehicle Registry",
    "/drivers": "Driver Management",
    "/dispatcher": "Trip Dispatcher",
    "/maintenance": "Maintenance Logs",
    "/expenses": "Expense & Fuel Logging",
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
                {/* Search */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-48 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                    />
                </div>

                {/* Bell */}
                <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        3
                    </span>
                </button>

                <div className="h-6 w-px bg-gray-200" />

                {/* User + Role */}
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
