import React from "react";
import Card from "./Card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
    title: string;
    value: React.ReactNode;
    description: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: "blue" | "orange" | "green" | "red" | "indigo";
}

export default function StatCard({ title, value, description, trend, color }: StatCardProps) {
    const colorClasses = {
        blue: "text-blue-600",
        orange: "text-orange-600",
        green: "text-emerald-600",
        red: "text-red-600",
        indigo: "text-indigo-600",
    };

    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className={`text-2xl font-bold ${color ? colorClasses[color] : "text-gray-900"}`}>{value}</p>
                </div>
                {trend && (
                    <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${trend.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}>
                        {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trend.value}%
                    </div>
                )}
            </div>
            {description && (
                <p className="mt-2 text-sm text-gray-400 font-medium">{description}</p>
            )}
        </Card>
    );
}
