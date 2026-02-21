"use client";

import React, { useEffect, useState } from "react";
import { getVehicles } from "@/lib/api";
import Card from "@/components/ui/Card";
import StatusPill from "@/components/ui/StatusPill";
import DataTable from "@/components/ui/DataTable";

function getStatusVariant(status: string) {
    const s = status?.toLowerCase();
    if (s === "active") return "available" as const;
    if (s === "maintenance" || s === "in_maintenance") return "inShop" as const;
    if (s === "inactive" || s === "retired") return "danger" as const;
    return "available" as const;
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVehicles()
            .then((data) => setVehicles(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const headers = ["ID", "Model", "License Plate", "Year", "Mileage", "Fuel Type", "Status"];

    const rows = vehicles.map((v: any) => [
        v.id,
        v.model || "—",
        v.licensePlate || "—",
        v.year || "—",
        v.mileage != null ? v.mileage.toLocaleString() : "—",
        v.fuelType || "—",
        <StatusPill
            key={v.id}
            variant={getStatusVariant(v.status)}
            label={v.status || "Unknown"}
        />,
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {loading ? "Loading..." : `${vehicles.length} vehicles registered`}
                </p>
            </div>

            <Card className="p-0">
                {loading ? (
                    <div className="p-6">
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 bg-gray-50 rounded" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <DataTable headers={headers} rows={rows} />
                )}
            </Card>
        </div>
    );
}
