"use client";

import React, { useEffect, useState } from "react";
import { getVehicles, getDrivers, getFleetRisk } from "@/lib/api";
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

    useEffect(() => {
        // Promise.all([getVehicles(), getDrivers(), getFleetRisk()])
        //     .then(([v, d, r]) => {
        //         setVehicles(Array.isArray(v) ? v : []);
        //         setDrivers(Array.isArray(d) ? d : []);
        //         setRisk(r);
        //     })
        //     .catch(console.error)
        //     .finally(() => setLoading(false));
        const dummyVehicles = [
            {
                id: 1,
                model: "Van-01",
                status: "active",
                totalFuelCost: 45000,
                totalMaintenanceCost: 12000,
                fuelEfficiency: 18,
            },
            {
                id: 2,
                model: "Truck-05",
                status: "active",
                totalFuelCost: 98000,
                totalMaintenanceCost: 40000,
                fuelEfficiency: 9,
            },
            {
                id: 3,
                model: "Bike-02",
                status: "maintenance",
                totalFuelCost: 12000,
                totalMaintenanceCost: 3000,
                fuelEfficiency: 35,
            },
            {
                id: 4,
                model: "Trailer-XL",
                status: "active",
                totalFuelCost: 150000,
                totalMaintenanceCost: 60000,
                fuelEfficiency: 6,
            },
        ];

        const dummyRisk = {
            risk: 68,
            level: "Moderate",
            factors: {
                expiredDrivers: 20,
                vehiclesInShop: 15,
                negativeROI: 18,
                overdueMaintenance: 15,
            },
        };

        setVehicles(dummyVehicles);
        setDrivers([{ id: 1 }, { id: 2 }]);
        setRisk(dummyRisk);
        setLoading(false);
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
    // ===== Financial Calculations =====

    // Total Fuel Cost
    const totalFuelCost = vehicles.reduce(
        (sum: number, v: any) => sum + (v.totalFuelCost || 0),
        0
    );

    // Total Maintenance Cost
    const totalMaintenanceCost = vehicles.reduce(
        (sum: number, v: any) => sum + (v.totalMaintenanceCost || 0),
        0
    );

    // Simulated Revenue (if backend doesn’t provide)
    const totalRevenue = vehicles.reduce(
        (sum: number, v: any) => sum + (v.totalRevenue || 0),
        0
    );

    // Fleet ROI
    const fleetROI =
        totalRevenue > 0
            ? (((totalRevenue - totalFuelCost - totalMaintenanceCost) / totalRevenue) * 100).toFixed(1)
            : 0;

    // Utilization Rate
    const activeVehicles = vehicles.filter(
        (v: any) => v.status === "active"
    ).length;

    const utilizationRate =
        vehicles.length > 0
            ? ((activeVehicles / vehicles.length) * 100).toFixed(0)
            : 0;


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

    const monthlyData = [
        {
            month: "Jan",
            revenue: 300000,
            fuel: 120000,
            maintenance: 55000,
        },
        {
            month: "Feb",
            revenue: 280000,
            fuel: 100000,
            maintenance: 40000,
        },
        {
            month: "Mar",
            revenue: 350000,
            fuel: 150000,
            maintenance: 70000,
        },
    ];

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
                                        (v.totalMaintenanceCost || 0),
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
                    rows={monthlyData.map((m) => [
                        m.month,
                        `₹ ${m.revenue.toLocaleString()}`,
                        `₹ ${m.fuel.toLocaleString()}`,
                        `₹ ${m.maintenance.toLocaleString()}`,
                        `₹ ${(m.revenue - m.fuel - m.maintenance).toLocaleString()}`,
                    ])}
                />
            </div>

        </div>
    );
}
