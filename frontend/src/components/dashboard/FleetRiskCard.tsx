"use client";

import React from "react";
import StatusPill from "../ui/StatusPill";

interface FleetRiskData {
    risk: number;
    level: string;
    factors: Record<string, number>;
}

interface FleetRiskCardProps {
    data: FleetRiskData | null;
    loading: boolean;
}

function getLevelVariant(level: string) {
    switch (level) {
        case "Low":
            return "success" as const;
        case "Moderate":
            return "warning" as const;
        case "High":
            return "danger" as const;
        default:
            return "available" as const;
    }
}

function getLevelColor(level: string) {
    switch (level) {
        case "Low":
            return "text-emerald-600";
        case "Moderate":
            return "text-yellow-600";
        case "High":
            return "text-red-600";
        default:
            return "text-gray-600";
    }
}

function getBarColor(key: string) {
    switch (key) {
        case "vehicleAge":
            return "bg-blue-500";
        case "maintenanceOverdue":
            return "bg-red-500";
        case "avgFuelEfficiency":
            return "bg-yellow-500";
        case "driverExperience":
            return "bg-emerald-500";
        default:
            return "bg-gray-400";
    }
}

function formatFactorLabel(key: string) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
}

export default function FleetRiskCard({ data, loading }: FleetRiskCardProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
                <div className="h-12 w-24 bg-gray-100 rounded" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-gray-500">Fleet Risk Score</p>
                <StatusPill variant={getLevelVariant(data.level)} label={data.level} />
            </div>

            <div className="mt-3 flex items-baseline gap-1">
                <span className={`text-5xl font-bold ${getLevelColor(data.level)}`}>
                    {data.risk}
                </span>
                <span className="text-lg text-gray-400">/100</span>
            </div>

            {data.factors && (
                <div className="mt-5 space-y-3">
                    {Object.entries(data.factors).map(([key, value]) => (
                        <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-600">
                                    {formatFactorLabel(key)}
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                    {typeof value === "number" ? Math.round(value) : value}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${getBarColor(key)}`}
                                    style={{
                                        width: `${Math.min(typeof value === "number" ? value : 0, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
