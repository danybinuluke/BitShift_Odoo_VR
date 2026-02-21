"use client";

import React from "react";
import StatusPill from "../ui/StatusPill";

interface RecommendationData {
    finalScore: number;
    level: string;
    factors?: Record<string, number>;
}

interface RecommendationCardProps {
    data: RecommendationData | null;
}

function getLevelVariant(level: string) {
    switch (level) {
        case "Optimal":
            return "success" as const;
        case "Acceptable":
        case "Moderate":
            return "warning" as const;
        case "Poor":
        case "Not Recommended":
            return "danger" as const;
        default:
            return "available" as const;
    }
}

function getLevelColor(level: string) {
    switch (level) {
        case "Optimal":
            return "text-emerald-600";
        case "Acceptable":
        case "Moderate":
            return "text-yellow-600";
        case "Poor":
        case "Not Recommended":
            return "text-red-600";
        default:
            return "text-gray-600";
    }
}

function formatFactorLabel(key: string) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
}

export default function RecommendationCard({ data }: RecommendationCardProps) {
    if (!data) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                    Assignment Recommendation
                </h3>
                <StatusPill variant={getLevelVariant(data.level)} label={data.level} />
            </div>

            <div className="flex items-baseline gap-1 mb-4">
                <span className={`text-4xl font-bold ${getLevelColor(data.level)}`}>
                    {data.finalScore.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">score</span>
            </div>

            {data.factors && Object.keys(data.factors).length > 0 && (
                <div className="space-y-2 border-t border-gray-100 pt-4">
                    {Object.entries(data.factors).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{formatFactorLabel(key)}</span>
                            <span className="font-medium text-gray-800">
                                {typeof value === "number" ? value.toFixed(2) : value}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
