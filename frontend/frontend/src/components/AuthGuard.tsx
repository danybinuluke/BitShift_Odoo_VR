"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/authService";

/**
 * AuthGuard – redirects to /auth if no user in localStorage.
 * Skips protection for the /auth route itself.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // Don't guard the auth page itself
        if (pathname === "/auth") {
            setChecked(true);
            return;
        }

        const user = getStoredUser();
        if (!user) {
            router.replace("/auth");
        } else {
            setChecked(true);
        }
    }, [pathname, router]);

    // Show nothing while checking (prevents flash)
    if (!checked && pathname !== "/auth") {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
                <div className="animate-pulse text-sm text-gray-400">Loading...</div>
            </div>
        );
    }

    return <>{children}</>;
}
