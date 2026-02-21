"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { RoleProvider } from "@/context/RoleContext";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

/**
 * Client layout: wraps app with auth guard, role provider,
 * and conditionally renders sidebar/topbar (hidden on /auth).
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/auth";

    return (
        <RoleProvider>
            <AuthGuard>
                {isAuthPage ? (
                    // Auth page: full-screen, no sidebar/topbar
                    <>{children}</>
                ) : (
                    // Dashboard pages: sidebar + topbar shell
                    <>
                        <Sidebar />
                        <div className="min-h-screen bg-[#F9FAFB] relative z-0">
                            <Topbar />
                            <main className="p-6">{children}</main>
                        </div>
                    </>
                )}
            </AuthGuard>
        </RoleProvider>
    );
}
