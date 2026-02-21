import React from "react";

interface ProgressBarProps {
    label: string;
    percentage: number;
    color?: string;
}

export default function ProgressBar({
    label,
    percentage,
    color = "bg-blue-500",
}: ProgressBarProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">{label}</span>
                <span className="text-sm font-medium text-gray-500">{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
