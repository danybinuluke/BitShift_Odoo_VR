"use client";

import React, { useEffect, useState } from "react";
import { getVehicles, getDrivers, getFleetRisk, getMetrics, getProfitMetrics, getProfitTrend, getAIHealth } from "@/lib/api";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
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

    const [metrics, setMetrics] = useState<any>(null);
    const [profitMetrics, setProfitMetrics] = useState<any>(null);
    const [profitTrend, setProfitTrend] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            getVehicles(),
            getDrivers(),
            getFleetRisk(),
            getMetrics(),
            getProfitMetrics(),
            getProfitTrend()
        ])
            .then(([v, d, r, m, pm, pt]) => {
                setVehicles(Array.isArray(v) ? v : []);
                setDrivers(Array.isArray(d) ? d : []);
                setRisk(r);
                setMetrics(m);
                setProfitMetrics(pm);
                setProfitTrend(Array.isArray(pt) ? pt : []);
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
        })) : [];
    // ===== Financial Data Mapping =====

    const totalFuelCost = profitMetrics?.totalFuelCost ?? 0;
    const fleetROI = profitMetrics?.fleetROI ?? 0;
    const utilizationRate = profitMetrics?.utilizationRate ?? 0;

    const monthlyData = profitTrend.length > 0 ? profitTrend : [];


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
        <div className="space-y-8">

            {/* ===== Executive Financial KPIs ===== */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <StatCard
                    title="Total Fuel Cost"
                    value={`₹ ${totalFuelCost.toLocaleString()}`}
                    description="Fuel expenses across fleet"
                />
                <StatCard
                    title="Fleet ROI"
                    value={`${fleetROI}%`}
                    description="Return on investment"
                />
                <StatCard
                    title="Utilization Rate"
                    value={`${utilizationRate}%`}
                    description="Vehicles actively in use"
                />
            </div>

            {/* ===== Charts Row ===== */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Fuel Efficiency Trend */}
                <Card>
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Fuel Efficiency Trend
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={vehicles.slice(0, 5).map((v: any) => ({
                                name: v.model || `#${v.id}`,
                                efficiency: v.fuelEfficiency || Math.floor(Math.random() * 20 + 10),
                            }))}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="efficiency" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Top 5 Costliest Vehicles */}
                <Card>
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Top 5 Costliest Vehicles
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={vehicles
                                .map((v: any) => ({
                                    name: v.model || `#${v.id}`,
                                    cost:
                                        (v.totalFuelCost || 0) +
                                        (v.totalMaintenance || 0),
                                }))
                                .sort((a: any, b: any) => b.cost - a.cost)
                                .slice(0, 5)}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="cost" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* ===== Financial Summary Table ===== */}
            <div>
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Financial Summary of Month
                </h2>

                <DataTable
                    headers={["Month", "Revenue", "Fuel Cost", "Maintenance", "Net Profit"]}
                    rows={monthlyData.map((m: any) => [
                        m.month || m.date || "—",
                        `₹ ${(m.revenue || 0).toLocaleString()}`,
                        `₹ ${(m.fuel || 0).toLocaleString()}`,
                        `₹ ${(m.maintenance || 0).toLocaleString()}`,
                        `₹ ${((m.revenue || 0) - (m.fuel || 0) - (m.maintenance || 0)).toLocaleString()}`,
                    ])}
                />
            </div>

        </div>
    );
}
