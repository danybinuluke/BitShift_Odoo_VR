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
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                {/* Header */}
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-center w-12">No.</th>
                        <th className="px-6 py-4 font-semibold">Trip ID</th>
                        <th className="px-6 py-4 font-semibold">Vehicle</th>
                        <th className="px-6 py-4 font-semibold">Driver</th>
                        <th className="px-6 py-4 font-semibold text-right">Status</th>
                    </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-gray-100">
                    {trips.length === 0 ? (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-6 py-6 text-center text-sm text-gray-500"
                            >
                                No trips available.
                            </td>
                        </tr>
                    ) : (
                        trips.map((trip, index) => (
                            <tr
                                key={trip.id}
                                className="transition hover:bg-gray-50"
                            >
                                <td className="px-6 py-5 font-medium text-gray-400 text-center">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-5 font-semibold text-gray-900">
                                    {trip.id}
                                </td>
                                <td className="px-6 py-5 text-gray-700">
                                    {trip.vehicle}
                                </td>
                                <td className="px-6 py-5 text-gray-700">
                                    {trip.driver}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                                            trip.status
                                        )}`}
                                    >
                                        {trip.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}