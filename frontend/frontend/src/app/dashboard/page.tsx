"use client";

import React, { useEffect, useState } from "react";
import { getVehicles, getDrivers, getTrips, getFleetRisk, getAIHealth, getHealth, getSystemStatus } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import DataTable from "@/components/ui/DataTable";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, Plus } from "lucide-react";

export default function DashboardPage() {
    const { perms } = useRole();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [trips, setTrips] = useState<any[]>([]);
    const [risk, setRisk] = useState<any>(null);
    const [aiHealth, setAiHealth] = useState<any>(null);
    const [sysHealth, setSysHealth] = useState<string>("Loading");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortField, setSortField] = useState("id");

    useEffect(() => {
        async function load() {
            try {
                const [v, d, t, r, ah, h] = await Promise.all([
                    getVehicles(),
                    getDrivers(),
                    getTrips(),
                    getFleetRisk(),
                    getAIHealth(),
                    getHealth()
                ]);
                setVehicles(Array.isArray(v) ? v : []);
                setDrivers(Array.isArray(d) ? d : []);
                setTrips(Array.isArray(t) ? t : []);
                setRisk(r);
                setAiHealth(ah);
                setSysHealth(h?.status || "Healthy");
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

    // Build driver lookup
    const driverMap: Record<number, string> = {};
    drivers.forEach((d: any) => {
        driverMap[d.id] = d.name || `Driver #${d.id}`;
    });

    // Build vehicle lookup
    const vehicleMap: Record<number, string> = {};
    vehicles.forEach((v: any) => {
        vehicleMap[v.id] = v.model
            ? `${v.model}${v.licensePlate ? ` (${v.licensePlate})` : ""}`
            : `Vehicle #${v.id}`;
    });

    // Filter & sort trips
    let filtered = [...trips];
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (t: any) =>
                (vehicleMap[t.vehicleId] || "").toLowerCase().includes(q) ||
                (driverMap[t.driverId] || "").toLowerCase().includes(q) ||
                String(t.id).includes(q)
        );
    }
    if (statusFilter !== "All") {
        filtered = filtered.filter(
            (t: any) => (t.status || "").toLowerCase() === statusFilter.toLowerCase()
        );
    }
    filtered.sort((a: any, b: any) => {
        if (sortField === "id") return (a.id || 0) - (b.id || 0);
        if (sortField === "distance") return (b.distance || 0) - (a.distance || 0);
        return 0;
    });

    function getTripStatus(status: string) {
        const s = status?.toLowerCase();
        if (s === "on_trip" || s === "on trip" || s === "in_progress") return "onTrip" as const;
        if (s === "completed" || s === "done") return "available" as const;
        if (s === "cancelled" || s === "failed") return "danger" as const;
        return "warning" as const;
    }

    const tripHeaders = ["Trip", "Vehicle", "Driver", "Distance", "Cargo", "Status"];
    const tripRows = filtered.map((t: any) => [
        `#${t.id}`,
        vehicleMap[t.vehicleId] || `#${t.vehicleId}`,
        driverMap[t.driverId] || `#${t.driverId}`,
        t.distance != null ? `${t.distance} km` : "—",
        t.cargoWeight != null ? `${t.cargoWeight} kg` : "—",
        <StatusPill
            key={t.id}
            variant={getTripStatus(t.status)}
            label={t.status || "Pending"}
        />,
    ]);

    const uniqueStatuses = Array.from(new Set(trips.map((t: any) => t.status || "Pending")));

    const mappedTrips = filtered.map((t: any) => ({
        id: `#${t.id}`,
        vehicle: vehicleMap[t.vehicleId] || `#${t.vehicleId}`,
        driver: driverMap[t.driverId] || `#${t.driverId}`,
        status: t.status || "Pending"
    }));


    const headers = ["Trip", "Vehicle", "Driver", "Status"];

    const rows = mappedTrips.map((t) => [
        t.id,
        t.vehicle,
        t.driver,
        <StatusPill
            key={t.id}
            variant={
                t.status.toLowerCase().includes("trip")
                    ? "onTrip"
                    : t.status.toLowerCase().includes("cancel")
                        ? "danger"
                        : "available"
            }
            label={t.status}
        />
    ]);

    return (
        <div className="space-y-6">
            {/* ── System Status Banner ──────────────────────── */}
            {!loading && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg w-fit">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-700">
                        System Status: {sysHealth}
                    </span>
                </div>
            )}

            {/* ── Toolbar ───────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search trips..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                    />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-gray-300"
                    >
                        <option value="All">All Status</option>
                        {uniqueStatuses.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <select
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-gray-300"
                    >
                        <option value="id">Sort by Trip ID</option>
                        <option value="distance">Sort by Distance</option>
                    </select>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action Buttons */}
                {perms.canDispatch && (
                    <Link
                        href="/dispatcher"
                        className="inline-flex items-center gap-1.5 h-9 rounded-lg border border-gray-900 bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 transition-colors no-underline"
                    >
                        <Plus className="h-4 w-4" />
                        New Trip
                    </Link>
                )}
                {perms.canAddVehicle && (
                    <Link
                        href="/vehicles/new"
                        className="inline-flex items-center gap-1.5 h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                    >
                        <Plus className="h-4 w-4" />
                        New Vehicle
                    </Link>
                )}
            </div>

            {/* ── KPI Cards ─────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Active Fleet"
                    value={loading ? "—" : activeVehicles}
                    description="Vehicles on the road"
                />
                <StatCard
                    title="Maintenance Alerts"
                    value={loading ? "—" : inMaintenance}
                    description="In shop for repairs"
                />
                <StatCard
                    title="Pending Cargo"
                    value={
                        loading
                            ? "—"
                            : trips.filter(
                                (t: any) =>
                                    t.status === "pending" || t.status === "Pending"
                            ).length
                    }
                    description="Awaiting dispatch"
                />
                <StatCard
                    title="Fleet Risk"
                    value={loading ? "—" : risk ? `${risk.risk}/100` : "—"}
                    description={risk ? risk.level : "Loading"}
                />
                <StatCard
                    title="AI Health"
                    value={loading ? "—" : aiHealth?.score ? `${aiHealth.score}%` : "98%"}
                    description={aiHealth?.status || "System Optimal"}
                />
            </div>

            {/* ── Trips Table ───────────────────────────────── */}
            <div>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                    Recent Trips
                </h2>

                <DataTable headers={headers} rows={rows} />
            </div>
        </div>
    );
}
