"use client";

import React, { useEffect, useState } from "react";
import {
    getMaintenanceLogs,
    createMaintenanceLog,
    getVehicles,
} from "@/lib/api";
import Card from "@/components/ui/Card";
import StatusPill from "@/components/ui/StatusPill";
import DataTable from "@/components/ui/DataTable";
import AccessControl from "@/components/AccessControl";
import { Search, SlidersHorizontal, ArrowUpDown, Layers } from "lucide-react";

export default function MaintenancePage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [vehicleId, setVehicleId] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // Toolbar state
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortField, setSortField] = useState("id");
    const [groupBy, setGroupBy] = useState("none");

    async function loadData() {
        try {
            const [m, v] = await Promise.all([getMaintenanceLogs(), getVehicles()]);
            setLogs(Array.isArray(m) ? m : []);
            setVehicles(Array.isArray(v) ? v : []);
        } catch (err) {
            console.error("Failed to load maintenance data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {
        setVehicleId("");
        setType("");
        setDescription("");
        setCost("");
        setDate(new Date().toISOString().split("T")[0]);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicleId || !type || !description || !cost) return;

        setSubmitting(true);
        try {
            await createMaintenanceLog({
                vehicleId: Number(vehicleId),
                type,
                description,
                cost: Number(cost),
                date,
            });
            resetForm();
            setLoading(true);
            await loadData();
        } catch (err) {
            console.error("Failed to create maintenance log:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Vehicle name lookup
    function vehicleName(id: number) {
        const v = vehicles.find((veh: any) => veh.id === id);
        return v ? `${v.model} ${v.licensePlate ? `(${v.licensePlate})` : `#${v.id}`}` : `#${id}`;
    }

    // Status variant
    function getStatusVariant(status: string) {
        const s = (status || "").toLowerCase();
        if (s === "new" || s === "pending") return "warning" as const;
        if (s === "in_progress" || s === "in progress") return "onTrip" as const;
        if (s === "completed" || s === "done") return "available" as const;
        if (s === "cancelled") return "danger" as const;
        return "inShop" as const;
    }

    // Type variant
    function getTypeVariant(t: string) {
        const s = t?.toLowerCase();
        if (s === "repair" || s === "emergency") return "danger" as const;
        if (s === "inspection" || s === "scheduled") return "warning" as const;
        if (s === "oil change" || s === "routine") return "available" as const;
        return "inShop" as const;
    }

    // ── Filter, search, sort ────────────────────────────
    let filtered = [...logs];

    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (log: any) =>
                String(log.id).includes(q) ||
                vehicleName(log.vehicleId).toLowerCase().includes(q) ||
                (log.type || "").toLowerCase().includes(q) ||
                (log.description || "").toLowerCase().includes(q)
        );
    }

    if (statusFilter !== "All") {
        filtered = filtered.filter(
            (log: any) => (log.status || "New").toLowerCase() === statusFilter.toLowerCase()
        );
    }

    filtered.sort((a: any, b: any) => {
        if (sortField === "id") return (b.id || 0) - (a.id || 0);
        if (sortField === "cost") return (b.cost || 0) - (a.cost || 0);
        if (sortField === "date") return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        return 0;
    });

    // Unique statuses for filter dropdown
    const uniqueStatuses = Array.from(new Set(logs.map((l: any) => l.status || "New")));

    // ── Table ───────────────────────────────────────────
    const headers = ["Log ID", "Vehicle", "Issue/Service", "Date", "Cost", "Status"];
    const rows = filtered.map((log: any) => [
        log.id,
        vehicleName(log.vehicleId),
        <StatusPill key={`t-${log.id}`} variant={getTypeVariant(log.type)} label={log.type || "—"} />,
        log.date || "—",
        log.cost != null ? `$${Number(log.cost).toLocaleString()}` : "—",
        <StatusPill key={`s-${log.id}`} variant={getStatusVariant(log.status)} label={log.status || "New"} />,
    ]);

    return (
        <AccessControl allowedRoles={["Manager", "Safety"]}>
            <div className="space-y-6">
                {/* ── New Service Form (collapsible) ──────────── */}
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-1.5 h-9 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                    >
                        + New Service
                    </button>
                ) : (
                    <Card>
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                            New Service
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                                <select
                                    value={vehicleId}
                                    onChange={(e) => setVehicleId(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                >
                                    <option value="">Select vehicle</option>
                                    {vehicles.map((v: any) => (
                                        <option key={v.id} value={v.id}>
                                            {v.model} {v.licensePlate ? `(${v.licensePlate})` : `#${v.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue/Service</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                >
                                    <option value="">Select type</option>
                                    <option value="Routine">Routine</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Inspection">Inspection</option>
                                    <option value="Oil Change">Oil Change</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Engine Issue">Engine Issue</option>
                                    <option value="Tire Replacement">Tire Replacement</option>
                                    <option value="Brake Service">Brake Service</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                                <input
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    placeholder="e.g. 250"
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of maintenance work"
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                />
                            </div>

                            {/* Create / Cancel buttons */}
                            <div className="flex items-end gap-3 sm:col-span-3">
                                <button
                                    type="submit"
                                    disabled={!vehicleId || !type || !description || !cost || submitting}
                                    className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                                >
                                    {submitting ? "Saving..." : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* ── Toolbar: Search + Group by + Filter + Sort ─ */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                        />
                    </div>

                    {/* Group by */}
                    <div className="flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-gray-500" />
                        <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-gray-300"
                        >
                            <option value="none">Group by</option>
                            <option value="vehicle">Vehicle</option>
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
                            className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-gray-300"
                        >
                            <option value="All">Filter</option>
                            {uniqueStatuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
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
                            <option value="id">Sort by</option>
                            <option value="id">Log ID</option>
                            <option value="cost">Cost</option>
                            <option value="date">Date</option>
                        </select>
                    </div>
                </div>

                {/* ── Maintenance Records Table ──────────────── */}
                <Card className="p-0">
                    <div className="px-6 pt-6 pb-2">
                        <h2 className="text-base font-semibold text-gray-900">
                            Maintenance Records
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {loading ? (
                                "Loading..."
                            ) : search || statusFilter !== "All" ? (
                                <>
                                    Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of <span className="font-semibold text-gray-900">{logs.length}</span> records
                                    <button
                                        onClick={() => { setSearch(""); setStatusFilter("All"); }}
                                        className="ml-2 text-xs text-blue-600 hover:underline font-medium"
                                    >
                                        Clear
                                    </button>
                                </>
                            ) : (
                                <><span className="font-semibold text-gray-900">{logs.length}</span> records registered</>
                            )}
                        </p>
                    </div>
                    {loading ? (
                        <div className="p-6">
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-10 bg-gray-50 rounded" />
                                ))}
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="px-6 pb-6">
                            <p className="text-sm text-gray-400">No maintenance records found.</p>
                        </div>
                    ) : (
                        <DataTable headers={headers} rows={rows} />
                    )}
                </Card>
            </div>
        </AccessControl>
    );
}
