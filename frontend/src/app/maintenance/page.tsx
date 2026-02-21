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

export default function MaintenancePage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [vehicleId, setVehicleId] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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
            // Reset form
            setVehicleId("");
            setType("");
            setDescription("");
            setCost("");
            setDate(new Date().toISOString().split("T")[0]);
            // Reload data
            setLoading(true);
            await loadData();
        } catch (err) {
            console.error("Failed to create maintenance log:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Get vehicle name by ID
    function vehicleName(id: number) {
        const v = vehicles.find((veh: any) => veh.id === id);
        return v ? `${v.model} ${v.licensePlate ? `(${v.licensePlate})` : `#${v.id}`}` : `#${id}`;
    }

    function getTypeVariant(t: string) {
        const s = t?.toLowerCase();
        if (s === "repair" || s === "emergency") return "danger" as const;
        if (s === "inspection" || s === "scheduled") return "warning" as const;
        if (s === "oil change" || s === "routine") return "available" as const;
        return "inShop" as const;
    }

    const headers = ["ID", "Vehicle", "Type", "Description", "Cost", "Date"];
    const rows = logs.map((log: any) => [
        log.id,
        vehicleName(log.vehicleId),
        <StatusPill key={`t-${log.id}`} variant={getTypeVariant(log.type)} label={log.type || "—"} />,
        log.description || "—",
        log.cost != null ? `$${Number(log.cost).toLocaleString()}` : "—",
        log.date || "—",
    ]);

    return (
        <div className="space-y-6">
            {/* Add Maintenance Log Form */}
            <Card>
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Add Maintenance Log
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
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
                        </select>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
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

                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={!vehicleId || !type || !description || !cost || submitting}
                            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {submitting ? "Saving..." : "Add Log"}
                        </button>
                    </div>
                </form>
            </Card>

            {/* Maintenance Records Table */}
            <Card className="p-0">
                <div className="px-6 pt-6 pb-2">
                    <h2 className="text-base font-semibold text-gray-900">
                        Maintenance Records
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {loading ? "Loading..." : `${logs.length} records`}
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
                ) : logs.length === 0 ? (
                    <div className="px-6 pb-6">
                        <p className="text-sm text-gray-400">No maintenance records found.</p>
                    </div>
                ) : (
                    <DataTable headers={headers} rows={rows} />
                )}
            </Card>
        </div>
    );
}
