import React from "react";

type StatusVariant =
    | "available"
    | "onTrip"
    | "inShop"
    | "warning"
    | "danger"
    | "success";

interface StatusPillProps {
    variant: StatusVariant;
    label: string;
}

const variantStyles: Record<StatusVariant, string> = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    onTrip: "bg-blue-50 text-blue-700 border-blue-200",
    inShop: "bg-orange-50 text-orange-700 border-orange-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function StatusPill({ variant, label }: StatusPillProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]}`}
        >
            {label}
        </span>
    );
}
