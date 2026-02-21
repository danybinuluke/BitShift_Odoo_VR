"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getVehicles } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import Card from "@/components/ui/Card";
import StatusPill from "@/components/ui/StatusPill";
import DataTable from "@/components/ui/DataTable";
import AccessControl from "@/components/AccessControl";

function getStatusVariant(status: string) {
    const s = status?.toLowerCase();
    if (s === "active") return "available" as const;
    if (s === "maintenance" || s === "in_maintenance") return "inShop" as const;
    if (s === "inactive" || s === "retired") return "danger" as const;
    return "available" as const;
}

export default function VehiclesPage() {
    const { perms } = useRole();
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
        <AccessControl allowedRoles={["Manager", "Dispatcher", "Safety"]}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {loading ? "Loading..." : `${vehicles.length} vehicles registered`}
                    </p>
                    {perms.canAddVehicle && (
                        <Link
                            href="/vehicles/new"
                            className="inline-flex items-center gap-1.5 h-9 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Vehicle
                        </Link>
                    )}
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
        </AccessControl>
    );
}
