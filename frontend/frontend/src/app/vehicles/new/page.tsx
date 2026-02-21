"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Truck, Package, Activity, Info } from "lucide-react";
import { createVehicle } from "@/lib/api";
import AccessControl from "@/components/AccessControl";
import Card from "@/components/ui/Card";

export default function NewVehiclePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [model, setModel] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [capacity, setCapacity] = useState("");
    const [mileage, setMileage] = useState(0);
    const [type, setType] = useState("Heavy Truck");
    const [year, setYear] = useState(new Date().getFullYear());
    const [fuelType, setFuelType] = useState("Diesel");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await createVehicle({
                model,
                licensePlate,
                year,
                odometer: mileage,
                fuelType,
                type,
                capacity: parseInt(capacity) || 0
            });
            // Redirect back to vehicles list on success
            router.push("/vehicles");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to create vehicle");
            setLoading(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all";
    const labelClass = "block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide";

    return (
        <AccessControl allowedRoles={["Manager"]}>
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Sequence */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/vehicles"
                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-gray-400" />
                            New Vehicle Registration
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">Register a new asset to your digital garage</p>
                    </div>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                <Info className="w-5 h-5 text-red-500" />
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* License Plate */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>License Plate</label>
                                <input
                                    type="text"
                                    required
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value)}
                                    placeholder="e.g. MH 00"
                                    className={`${inputClass} uppercase`}
                                />
                            </div>

                            {/* Max Payload / Capacity */}
                            <div>
                                <label className={labelClass}>Max Payload (Capacity)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        placeholder="e.g. 5000"
                                        className={inputClass}
                                    />
                                    <Package className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Initial Odometer */}
                            <div>
                                <label className={labelClass}>Initial Odometer</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={mileage}
                                        onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
                                        className={inputClass}
                                    />
                                    <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Type */}
                            <div>
                                <label className={labelClass}>Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="Mini">Mini</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Heavy Truck">Heavy Truck</option>
                                    <option value="Trailer">Trailer</option>
                                    <option value="Specialized">Specialized</option>
                                </select>
                            </div>

                            {/* Model */}
                            <div>
                                <label className={labelClass}>Model / Manufacturing Year</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder="e.g. Volvo FH16"
                                        className={inputClass}
                                    />
                                    <input
                                        type="number"
                                        required
                                        min="1990"
                                        value={year}
                                        onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Fuel Type (Hidden/Defaulted since not in wireframe but in backend) */}
                            <div className="hidden">
                                <label className={labelClass}>Fuel Type</label>
                                <select
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <Link
                                href="/vehicles"
                                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 rounded-lg bg-gray-900 border border-gray-900 text-sm font-semibold text-white hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Card>

            </div>
        </AccessControl>
    );
}
