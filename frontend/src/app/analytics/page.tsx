"use client";

import React, { useEffect, useState } from "react";
import { getVehicles, getDrivers, getFleetRisk } from "@/lib/api";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

export default function AnalyticsPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [risk, setRisk] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getVehicles(), getDrivers(), getFleetRisk()])
            .then(([v, d, r]) => {
                setVehicles(Array.isArray(v) ? v : []);
                setDrivers(Array.isArray(d) ? d : []);
                setRisk(r);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Vehicle status distribution for pie chart
    const statusCounts: Record<string, number> = {};
    vehicles.forEach((v: any) => {
        const s = v.status || "unknown";
        statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    // Fleet risk factors for bar chart
    const factorData = risk?.factors
        ? Object.entries(risk.factors).map(([key, value]) => ({
            name: key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s: string) => s.toUpperCase())
                .trim(),
            value: typeof value === "number" ? Math.round(value) : 0,
        }))
        : [];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
                            <div className="h-8 w-16 bg-gray-100 rounded" />
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <StatCard
                    title="Total Vehicles"
                    value={vehicles.length}
                    description="In the fleet registry"
                />
                <StatCard
                    title="Total Drivers"
                    value={drivers.length}
                    description="Registered in system"
                />
                <StatCard
                    title="Fleet Risk"
                    value={risk ? `${risk.risk}/100` : "—"}
                    description={
                        risk ? (
                            <span
                                className={`font-semibold ${risk.level === "High"
                                        ? "text-red-600"
                                        : risk.level === "Moderate"
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                    }`}
                            >
                                {risk?.level}
                            </span>
                        ) : (
                            "Loading"
                        )
                    }
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Vehicle Status Pie */}
                <Card>
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Vehicle Status Distribution
                    </h2>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {statusData.map((_, idx) => (
                                        <Cell
                                            key={idx}
                                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-gray-400">No vehicle data available.</p>
                    )}
                </Card>

                {/* Risk Factors Bar */}
                <Card>
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Fleet Risk Factors
                    </h2>
                    {factorData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={factorData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={140}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-gray-400">No risk data available.</p>
                    )}
                </Card>
            </div>
        </div>
    );
}
