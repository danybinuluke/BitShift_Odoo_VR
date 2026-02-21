"use client";

import React, { useEffect, useState } from "react";
import { getExpenses, createExpense, getVehicles } from "@/lib/api";
import Card from "@/components/ui/Card";
import StatusPill from "@/components/ui/StatusPill";
import DataTable from "@/components/ui/DataTable";
import AccessControl from "@/components/AccessControl";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [vehicleId, setVehicleId] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    async function loadData() {
        try {
            const [e, v] = await Promise.all([getExpenses(), getVehicles()]);
            setExpenses(Array.isArray(e) ? e : []);
            setVehicles(Array.isArray(v) ? v : []);
        } catch (err) {
            console.error("Failed to load expense data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicleId || !category || !amount) return;

        setSubmitting(true);
        try {
            await createExpense({
                vehicleId: Number(vehicleId),
                category,
                amount: Number(amount),
                description,
                date,
            });
            // Reset form
            setVehicleId("");
            setCategory("");
            setAmount("");
            setDescription("");
            setDate(new Date().toISOString().split("T")[0]);
            // Reload
            setLoading(true);
            await loadData();
        } catch (err) {
            console.error("Failed to create expense:", err);
        } finally {
            setSubmitting(false);
        }
    };

    function vehicleName(id: number) {
        const v = vehicles.find((veh: any) => veh.id === id);
        return v ? `${v.model} ${v.licensePlate ? `(${v.licensePlate})` : `#${v.id}`}` : `#${id}`;
    }

    function getCategoryVariant(cat: string) {
        const s = cat?.toLowerCase();
        if (s === "fuel" || s === "diesel" || s === "petrol") return "warning" as const;
        if (s === "maintenance" || s === "repair") return "inShop" as const;
        if (s === "toll" || s === "parking") return "onTrip" as const;
        if (s === "insurance") return "available" as const;
        return "available" as const;
    }

    const headers = ["ID", "Vehicle", "Category", "Amount", "Description", "Date"];
    const rows = expenses.map((exp: any) => [
        exp.id,
        vehicleName(exp.vehicleId),
        <StatusPill
            key={`c-${exp.id}`}
            variant={getCategoryVariant(exp.category)}
            label={exp.category || "—"}
        />,
        exp.amount != null ? `$${Number(exp.amount).toLocaleString()}` : "—",
        exp.description || "—",
        exp.date || "—",
    ]);

    return (
        <AccessControl allowedRoles={["Manager", "Financial"]}>
            <div className="space-y-6">
                {/* Add Expense Form */}
                <Card>
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Log Expense
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                            >
                                <option value="">Select category</option>
                                <option value="Fuel">Fuel</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Repair">Repair</option>
                                <option value="Toll">Toll</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Parking">Parking</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g. 150"
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
                                placeholder="Brief description of expense"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={!vehicleId || !category || !amount || submitting}
                                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {submitting ? "Saving..." : "Log Expense"}
                            </button>
                        </div>
                    </form>
                </Card>

                {/* Expense Records Table */}
                <Card className="p-0">
                    <div className="px-6 pt-6 pb-2">
                        <h2 className="text-base font-semibold text-gray-900">
                            Expense Records
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {loading ? "Loading..." : `${expenses.length} records`}
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
                    ) : expenses.length === 0 ? (
                        <div className="px-6 pb-6">
                            <p className="text-sm text-gray-400">No expense records found.</p>
                        </div>
                    ) : (
                        <DataTable headers={headers} rows={rows} />
                    )}
                </Card>
            </div>
        </AccessControl>
    );
}
