"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, UserPlus, AlertCircle } from "lucide-react";
import { createDriver } from "@/lib/api";
import AccessControl from "@/components/AccessControl";
import Card from "@/components/ui/Card";

export default function NewDriverPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [name, setName] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
    const [experience, setExperience] = useState<number>(0);
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation: License Expiry
        if (licenseExpiryDate) {
            const expiry = new Date(licenseExpiryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (expiry < today) {
                setError("Cannot hire driver: Driving license has expired.");
                return;
            }
        }

        setLoading(true);

        try {
            await createDriver({
                name,
                licenseNumber,
                licenseExpiryDate,
                experience,
                phone
            });
            // Redirect back to drivers list on success
            router.push("/drivers");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to create driver");
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
                        href="/drivers"
                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-gray-400" />
                            Add New Driver
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">Register a new driver to your personnel registry</p>
                    </div>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className={inputClass}
                                />
                            </div>

                            {/* License Number */}
                            <div>
                                <label className={labelClass}>License Number</label>
                                <input
                                    type="text"
                                    required
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    placeholder="e.g. DL-12345678"
                                    className={inputClass}
                                />
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <label className={labelClass}>License Expiry Date</label>
                                <input
                                    type="date"
                                    required
                                    value={licenseExpiryDate}
                                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Experience */}
                            <div>
                                <label className={labelClass}>Experience (Years)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={experience}
                                    onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className={labelClass}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. +91 98765 43210"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <Link
                                href="/drivers"
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
                                        Save Driver
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
