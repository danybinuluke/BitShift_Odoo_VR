"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal, ArrowUpDown, Layers, Trash2, X } from "lucide-react";
import { getVehicles, deleteVehicle } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import Card from "@/components/ui/Card";
import StatusPill from "@/components/ui/StatusPill";
import DataTable from "@/components/ui/DataTable";
import AccessControl from "@/components/AccessControl";

export default function VehiclesPage() {
    const { perms } = useRole();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Toolbar state
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortField, setSortField] = useState("model");
    const [groupBy, setGroupBy] = useState("none");

    async function loadData() {
        setLoading(true);
        try {
            const data = await getVehicles();
            setVehicles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this vehicle from the registry?")) return;
        try {
            await deleteVehicle(id);
            await loadData();
        } catch (err) {
            alert("Failed to delete vehicle");
        }
    };

    function getStatusVariant(status: string) {
        const s = status?.toLowerCase();
        if (s === "active" || s === "available" || s === "idle") return "available" as const;
        if (s === "maintenance" || s === "in_maintenance" || s === "in service") return "inShop" as const;
        if (s === "on trip" || s === "on_trip") return "onTrip" as const;
        if (s === "inactive" || s === "retired") return "danger" as const;
        return "available" as const;
    }

    // ── Filter, search, sort ────────────────────────────
    let filtered = [...vehicles];

    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (v: any) =>
                (v.model || "").toLowerCase().includes(q) ||
                (v.licensePlate || "").toLowerCase().includes(q) ||
                (v.type || "").toLowerCase().includes(q)
        );
    }

    if (statusFilter !== "All") {
        filtered = filtered.filter(
            (v: any) => (v.status || "Idle").toLowerCase() === statusFilter.toLowerCase()
        );
    }

    filtered.sort((a: any, b: any) => {
        if (sortField === "model") return (a.model || "").localeCompare(b.model || "");
        if (sortField === "plate") return (a.licensePlate || "").localeCompare(b.licensePlate || "");
        if (sortField === "odometer") return (b.mileage || 0) - (a.mileage || 0);
        return 0;
    });

    // ── Table ───────────────────────────────────────────
    const headers = ["NO", "Plate", "Model", "Type", "Capacity", "Odometer", "Status", "Actions"];

    const rows = filtered.map((v: any, index: number) => [
        <span key={`no-${v.id}`} className="text-gray-500 font-medium">{index + 1}</span>,
        <span key={`plate-${v.id}`} className="font-semibold text-gray-900">{v.licensePlate || "—"}</span>,
        v.model || "—",
        <span key={`type-${v.id}`} className="text-gray-600">{v.type || "Standard"}</span>,
        v.capacity || "—",
        <span key={`odo-${v.id}`} className="text-gray-600">{(v.mileage || 0).toLocaleString()} km</span>,
        <StatusPill
            key={`s-${v.id}`}
            variant={getStatusVariant(v.status || "Idle")}
            label={v.status || "Idle"}
        />,
        <div key={`act-${v.id}`} className="flex items-center gap-2">
            <button
                onClick={() => handleDelete(v.id)}
                className="p-1 px-2 rounded-md hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                title="Remove Vehicle"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    ]);

    return (
        <AccessControl allowedRoles={["Manager", "Dispatcher", "Safety"]}>
            <div className="space-y-6">

                {/* Header Row */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Fleet Flow</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {loading ? (
                                "Loading..."
                            ) : search || statusFilter !== "All" ? (
                                <>
                                    Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of <span className="font-semibold text-gray-900">{vehicles.length}</span> assets
                                    <button
                                        onClick={() => { setSearch(""); setStatusFilter("All"); }}
                                        className="ml-2 text-xs text-blue-600 hover:underline font-medium"
                                    >
                                        Clear search
                                    </button>
                                </>
                            ) : (
                                <><span className="font-semibold text-gray-900">{vehicles.length}</span> assets registered</>
                            )}
                        </p>
                    </div>
                    {perms.canAddVehicle && (
                        <Link
                            href="/vehicles/new"
                            className="inline-flex items-center gap-1.5 h-9 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Add Vehicle
                        </Link>
                    )}
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search fleet..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                        />
                    </div>

                    {/* Group by */}
                    <div className="flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-gray-500" />
                        <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-900"
                        >
                            <option value="none">Group by</option>
                            <option value="type">Type</option>
                            <option value="status">Status</option>
                        </select>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-1.5">
                        <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-900"
                        >
                            <option value="All">Filter Status</option>
                            <option value="Idle">Idle</option>
                            <option value="On Trip">On Trip</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-1.5">
                        <ArrowUpDown className="h-4 w-4 text-gray-500" />
                        <select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-900"
                        >
                            <option value="model">Sort by Model</option>
                            <option value="plate">Sort by Plate</option>
                            <option value="odometer">Sort by Mileage</option>
                        </select>
                    </div>
                </div>

                {/* Vehicles Table */}
                <Card className="p-0 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-gray-900 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                            <p className="mt-2 text-sm text-gray-500">Scanning fleet database...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-sm text-gray-500">No assets found in the registry.</p>
                        </div>
                    ) : (
                        <DataTable headers={headers} rows={rows} />
                    )}
                </Card>
            </div>
        </AccessControl>
    );
}
