"use client";

import React, { useEffect, useState } from "react";
import { getExpenses, createExpense, getVehicles } from "@/lib/api";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import StatusPill from "@/components/ui/StatusPill";
import AccessControl from "@/components/AccessControl";
import { Plus, Receipt, Fuel, Toolbox, MinusCircle, CheckCircle2 } from "lucide-react";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [form, setForm] = useState({
        vehicleId: "",
        category: "Fuel",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
    });

    async function loadData() {
        setLoading(true);
        try {
            const [expData, vehData] = await Promise.all([getExpenses(), getVehicles()]);
            setExpenses(Array.isArray(expData) ? expData : []);
            setVehicles(Array.isArray(vehData) ? vehData : []);
        } catch (err) {
            console.error("Failed to load expenses:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createExpense({
                vehicleId: Number(form.vehicleId),
                category: form.category,
                amount: Number(form.amount),
                description: form.description,
                date: form.date,
            });
            setShowForm(false);
            setForm({
                vehicleId: "",
                category: "Fuel",
                amount: "",
                description: "",
                date: new Date().toISOString().split("T")[0],
            });
            loadData();
        } catch (err) {
            alert("Failed to save expense. Please check your inputs.");
        }
    };

    const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const fuelExpense = expenses.filter(e => e.category === "Fuel").reduce((sum, e) => sum + (e.amount || 0), 0);
    const maintenanceExpense = expenses.filter(e => e.category === "Maintenance").reduce((sum, e) => sum + (e.amount || 0), 0);

    const vehicleName = (id: number) => {
        const v = vehicles.find((veh) => veh.id === id);
        return v ? `${v.model} (${v.licensePlate})` : `#${id}`;
    };

    const headers = ["Index", "Vehicle", "Category", "Description", "Date", "Amount"];
    const rows = expenses.map((exp, index) => [
        <span key={`idx-${exp.id}`} className="text-gray-400 font-medium">{index + 1}</span>,
        <span key={`veh-${exp.id}`} className="font-medium text-gray-900">{vehicleName(exp.vehicleId)}</span>,
        <div key={`cat-${exp.id}`} className="flex items-center gap-1.5">
            {exp.category === "Fuel" ? (
                <Fuel className="w-3.5 h-3.5 text-orange-500" />
            ) : (
                <Toolbox className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span className="text-sm font-medium">{exp.category}</span>
        </div>,
        <span key={`desc-${exp.id}`} className="text-gray-600 truncate max-w-[200px] block">{exp.description || "—"}</span>,
        <span key={`date-${exp.id}`} className="text-gray-500 text-sm">{exp.date || "—"}</span>,
        <span key={`amt-${exp.id}`} className="font-bold text-gray-900">₹ {(exp.amount || 0).toLocaleString()}</span>
    ]);

    return (
        <AccessControl allowedRoles={["Manager", "Financial"]}>
            <div className="space-y-8 pb-12">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Expense & Fuel Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Track operational costs and fuel consumption across the fleet</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-sm ${showForm ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                            }`}
                    >
                        {showForm ? <Receipt className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {showForm ? "View Logs" : "Record Expense"}
                    </button>
                </div>

                {/* KPI Overview */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <StatCard
                        title="Total Expenditure"
                        value={`₹ ${totalExpense.toLocaleString()}`}
                        description="Cumulative fleet costs"
                        trend={{ value: 12, isPositive: false }}
                    />
                    <StatCard
                        title="Fuel Costs"
                        value={`₹ ${fuelExpense.toLocaleString()}`}
                        description="Month-to-date fuel spend"
                        color="orange"
                    />
                    <StatCard
                        title="Maintenance Spend"
                        value={`₹ ${maintenanceExpense.toLocaleString()}`}
                        description="Repairs and servicing"
                        color="blue"
                    />
                </div>

                {/* Form or Table */}
                {showForm ? (
                    <Card className="max-w-2xl mx-auto border-dashed border-2 bg-gray-50/50">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-blue-600" />
                                Record New Operational Expense
                            </h3>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</label>
                                    <select
                                        required
                                        value={form.vehicleId}
                                        onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="">Select a vehicle</option>
                                        {vehicles.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.model} - {v.licensePlate}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="Fuel">Fuel</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Toll">Toll / Permits</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="Miscellaneous">Miscellaneous</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0.00"
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                <textarea
                                    required
                                    placeholder="Enter details about the expense..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <Card className="p-0 overflow-hidden shadow-sm border-gray-200">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                                <p className="mt-4 text-sm text-gray-500 font-medium">Downloading operational logs...</p>
                            </div>
                        ) : expenses.length === 0 ? (
                            <div className="p-20 text-center bg-gray-50/30">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                                    <MinusCircle className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-900 font-semibold text-lg">No expenses found</p>
                                <p className="text-gray-500 text-sm mt-1">Start by recording your first operational expense.</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create First Entry
                                </button>
                            </div>
                        ) : (
                            <DataTable headers={headers} rows={rows} />
                        )}
                    </Card>
                )}
            </div>
        </AccessControl>
    );
}
