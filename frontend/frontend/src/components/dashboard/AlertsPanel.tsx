"use client";

import React from "react";
import AlertBox from "../ui/AlertBox";

interface Alert {
    id?: string;
    severity: "warning" | "danger" | "info";
    message: string;
    timestamp?: string;
}

interface AlertsPanelProps {
    alerts: Alert[];
    loading: boolean;
}

export default function AlertsPanel({ alerts, loading }: AlertsPanelProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="h-4 w-40 bg-gray-100 rounded mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-50 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
                Operational Alerts
            </h2>
            {alerts.length === 0 ? (
                <p className="text-sm text-gray-400">No alerts at this time.</p>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert, i) => (
                        <AlertBox
                            key={alert.id || i}
                            type={alert.severity}
                            message={alert.message}
                            timestamp={alert.timestamp}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
