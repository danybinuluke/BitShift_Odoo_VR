"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Truck,
    Users,
    Route,
    Wrench,
    Fuel,
    BarChart3,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Vehicles", href: "/vehicles", icon: Truck },
    { label: "Drivers", href: "/drivers", icon: Users },
    { label: "Dispatcher", href: "/dispatcher", icon: Route },
    { label: "Maintenance", href: "/maintenance", icon: Wrench },
    { label: "Expenses", href: "/expenses", icon: Fuel },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                    <Truck className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">FleetFlow</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        }`}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom */}
            <div className="border-t border-gray-200 px-5 py-4">
                <p className="text-xs text-gray-400">FleetFlow v1.0</p>
            </div>
        </aside>
    );
}
