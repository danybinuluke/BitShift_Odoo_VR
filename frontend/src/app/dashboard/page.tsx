"use client";

import React, { useEffect, useState } from "react";
import { getVehicles, getDrivers, getFleetRisk } from "@/lib/api";
import StatCard from "@/components/ui/StatCard";
import FleetRiskCard from "@/components/dashboard/FleetRiskCard";
import AlertsPanel from "@/components/dashboard/AlertsPanel";

export default function DashboardPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [risk, setRisk] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [v, d, r] = await Promise.all([
                    getVehicles(),
                    getDrivers(),
                    getFleetRisk(),
                ]);
                setVehicles(Array.isArray(v) ? v : []);
                setDrivers(Array.isArray(d) ? d : []);
                setRisk(r);
            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Derive stats
    const activeVehicles = vehicles.filter(
        (v: any) => v.status === "active" || v.status === "Active"
    ).length;
    const inMaintenance = vehicles.filter(
        (v: any) =>
            v.status === "maintenance" ||
            v.status === "Maintenance" ||
            v.status === "in_maintenance"
    ).length;
    const totalDrivers = drivers.length;

    // Build simple alerts from risk data
    const alerts: { id: string; severity: "warning" | "danger" | "info"; message: string }[] = [];
    if (risk) {
        if (risk.level === "High") {
            alerts.push({
                id: "r1",
                severity: "danger",
                message: `Fleet risk is HIGH (${risk.risk}/100). Immediate attention required.`,
            });
        } else if (risk.level === "Moderate") {
            alerts.push({
                id: "r1",
                severity: "warning",
                message: `Fleet risk is Moderate (${risk.risk}/100). Review recommended.`,
            });
        }
    }
    if (inMaintenance > 0) {
        alerts.push({
            id: "m1",
            severity: "warning",
            message: `${inMaintenance} vehicle(s) currently in maintenance.`,
        });
    }
    if (alerts.length === 0) {
        alerts.push({
            id: "ok",
            severity: "info",
            message: "All systems operating normally.",
        });
    }

    return (
        <div className="space-y-6">
            {/* Stat Cards + Risk Card */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <StatCard
                    title="Total Vehicles"
                    value={loading ? "—" : vehicles.length}
                    description="Registered in system"
                />
                <StatCard
                    title="Active Fleet"
                    value={loading ? "—" : activeVehicles}
                    description="Currently operational"
                />
                <StatCard
                    title="Total Drivers"
                    value={loading ? "—" : totalDrivers}
                    description="Registered drivers"
                />
                <FleetRiskCard data={risk} loading={loading} />
            </div>

            {/* Alerts */}
            <AlertsPanel alerts={alerts} loading={loading} />
        </div>
    );
}
