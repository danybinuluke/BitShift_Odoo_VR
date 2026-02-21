"use client";

import React, { useEffect, useState } from "react";
import { getDrivers } from "@/lib/api";
import Card from "@/components/ui/Card";
import StatusPill from "@/components/ui/StatusPill";
import DataTable from "@/components/ui/DataTable";

function getStatusVariant(status: string) {
    const s = status?.toLowerCase();
    if (s === "active" || s === "available") return "available" as const;
    if (s === "on_trip" || s === "on trip" || s === "ontrip") return "onTrip" as const;
    if (s === "inactive" || s === "off_duty") return "danger" as const;
    return "available" as const;
}

export default function DriversPage() {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDrivers()
            .then((data) => setDrivers(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const headers = ["ID", "Name", "License Number", "Experience (yrs)", "Rating", "Status"];

    const rows = drivers.map((d: any) => [
        d.id,
        d.name || "—",
        d.licenseNumber || d.license || "—",
        d.experience != null ? d.experience : "—",
        d.rating != null ? `${d.rating}/5` : "—",
        <StatusPill
            key={d.id}
            variant={getStatusVariant(d.status)}
            label={d.status || "Unknown"}
        />,
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {loading ? "Loading..." : `${drivers.length} drivers registered`}
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
