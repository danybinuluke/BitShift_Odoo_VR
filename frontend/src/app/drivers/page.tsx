"use client";

import React, { useEffect, useState } from "react";
import { getDrivers } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import { Plus, Search, SlidersHorizontal, ArrowUpDown, Layers } from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import StatusPill from "@/components/ui/StatusPill";
import DataTable from "@/components/ui/DataTable";
import AccessControl from "@/components/AccessControl";

export default function DriversPage() {
    const { perms } = useRole();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Toolbar state
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortField, setSortField] = useState("name");
    const [groupBy, setGroupBy] = useState("none");

    useEffect(() => {
        getDrivers()
            .then((data) => setDrivers(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // ── Filter, search, sort ────────────────────────────
    let filtered = [...drivers];

    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (d: any) =>
                (d.name || "").toLowerCase().includes(q) ||
                (d.licenseNumber || d.license || "").toLowerCase().includes(q)
        );
    }

    if (statusFilter !== "All") {
        filtered = filtered.filter(
            (d: any) => (d.status || "Active").toLowerCase() === statusFilter.toLowerCase()
        );
    }

    filtered.sort((a: any, b: any) => {
        if (sortField === "name") return (a.name || "").localeCompare(b.name || "");
        if (sortField === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortField === "expiry") return new Date(a.licenseExpiryDate || 0).getTime() - new Date(b.licenseExpiryDate || 0).getTime();
        return 0;
    });

    // Status variant helper
    function getStatusVariant(status: string) {
        const s = (status || "").toLowerCase();
        if (s === "active" || s === "available") return "available" as const;
        if (s === "on trip" || s === "on_trip") return "onTrip" as const;
        if (s === "inactive" || s === "suspended") return "danger" as const;
        return "inShop" as const;
    }

    // ── Table ───────────────────────────────────────────
    const headers = ["ID", "Name", "License Number", "Experience (yrs)", "Rating", "Status"];

    const rows = filtered.map((d: any) => [
        d.id,
        <div key={`name-${d.id}`} className="font-medium text-gray-900">{d.name || "—"}</div>,
        d.licenseNumber || d.license || "—",
        d.experience != null ? d.experience : "—",
        d.rating != null ? `${d.rating}/5` : "—",
        <StatusPill
            key={`s-${d.id}`}
            variant={getStatusVariant(d.status)}
            label={d.status || "Unknown"}
        />,
    ]);

    return (
        <AccessControl allowedRoles={["Manager", "Dispatcher", "Safety"]}>
            <div className="space-y-6">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Drivers Registry</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {loading ? (
                                "Loading..."
                            ) : search || statusFilter !== "All" ? (
                                <>
                                    Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of <span className="font-semibold text-gray-900">{drivers.length}</span> drivers
                                    <button
                                        onClick={() => { setSearch(""); setStatusFilter("All"); }}
                                        className="ml-2 text-xs text-blue-600 hover:underline font-medium"
                                    >
                                        Clear search
                                    </button>
                                </>
                            ) : (
                                <><span className="font-semibold text-gray-900">{drivers.length}</span> drivers registered</>
                            )}
                        </p>
                    </div>
                    {perms.canAddDriver && (
                        <Link
                            href="/drivers/new"
                            className="inline-flex items-center gap-1.5 h-9 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Add Driver
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
                            placeholder="Search drivers..."
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
                            <option value="status">Status</option>
                            <option value="rating">Rating</option>
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
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="On Trip">On Trip</option>
                            <option value="Inactive">Inactive</option>
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
                            <option value="name">Sort by Name</option>
                            <option value="rating">Sort by Rank</option>
                            <option value="expiry">Sort by Expiry</option>
                        </select>
                    </div>
                </div>

                {/* Drivers Table */}
                <Card className="p-0 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-gray-900 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                            <p className="mt-2 text-sm text-gray-500">Retrieving personnel records...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-sm text-gray-500">No personnel matching your search was found.</p>
                        </div>
                    ) : (
                        <DataTable headers={headers} rows={rows} />
                    )}
                </Card>
            </div>
        </AccessControl>
    );
}
