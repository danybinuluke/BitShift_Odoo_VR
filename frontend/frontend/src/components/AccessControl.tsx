"use client";

import React from "react";
import type { Role } from "@/config/rbac";
import { useRole } from "@/context/RoleContext";
import { ShieldX } from "lucide-react";

interface AccessControlProps {
    allowedRoles: Role[];
    children: React.ReactNode;
}

export default function AccessControl({ allowedRoles, children }: AccessControlProps) {
    const { role } = useRole();

    if (allowedRoles.includes(role)) {
        return <>{children}</>;
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                    <ShieldX className="h-7 w-7 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    You do not have permission to view this module.
                    <br />
                    Contact your administrator if you believe this is an error.
                </p>
                <p className="mt-4 text-xs text-gray-400">
                    Current role: <span className="font-medium text-gray-500">{role}</span>
                </p>
            </div>
        </div>
    );
}
