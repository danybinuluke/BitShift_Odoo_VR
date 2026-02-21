"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/vehicles": "Vehicle Registry",
    "/drivers": "Driver Management",
    "/dispatcher": "Trip Dispatcher",
    "/maintenance": "Maintenance Logs",
    "/expenses": "Expense & Fuel Logging",
    "/analytics": "Operational Analytics",
};

export default function Topbar() {
    const pathname = usePathname();
    const title = pageTitles[pathname] || "Dashboard";

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-56 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
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

                {/* Role */}
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                        M
                    </div>
                    <p className="text-sm font-medium text-gray-700">Manager</p>
                </div>
            </div>
        </header>
    );
}
