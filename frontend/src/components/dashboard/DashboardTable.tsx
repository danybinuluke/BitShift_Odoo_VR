"use client";

import React from "react";

interface Trip {
    id: string;
    vehicle: string;
    driver: string;
    status: string;
}

interface Props {
    trips: Trip[];
}

function getStatusStyles(status: string) {
    switch (status) {
        case "Draft":
            return "bg-gray-700 text-white";
        case "Dispatched":
            return "bg-blue-700 text-white";
        case "Completed":
            return "bg-green-700 text-white";
        case "Cancelled":
            return "bg-red-700 text-white";
        default:
            return "bg-gray-700 text-white";
    }
}

export default function DashboardTable({ trips }: Props) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
            {/* Header */}
            <div className="grid grid-cols-4 bg-gray-50 text-sm font-semibold text-gray-600">
                <div className="border-r p-4">Trip</div>
                <div className="border-r p-4">Vehicle</div>
                <div className="border-r p-4">Driver</div>
                <div className="p-4">Status</div>
            </div>

            {/* Rows */}
            {trips.length === 0 ? (
                <div className="p-6 text-sm text-gray-500">
                    No trips available.
                </div>
            ) : (
                trips.map((trip) => (
                    <div
                        key={trip.id}
                        className="grid grid-cols-4 border-t text-sm hover:bg-gray-50"
                    >
                        <div className="border-r p-4">{trip.id}</div>
                        <div className="border-r p-4">{trip.vehicle}</div>
                        <div className="border-r p-4">{trip.driver}</div>
                        <div className="p-4">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                                    trip.status
                                )}`}
                            >
                                {trip.status}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}