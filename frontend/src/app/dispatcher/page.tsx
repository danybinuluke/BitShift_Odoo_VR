"use client";

import React, { useEffect, useState } from "react";
import {
    getVehicles,
    getDrivers,
    recommendAssignment,
    createTrip,
} from "@/lib/api";
import TripForm from "@/components/dispatcher/TripForm";
import RecommendationCard from "@/components/dispatcher/RecommendationCard";

export default function DispatcherPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [recommending, setRecommending] = useState(false);
    const [dispatching, setDispatching] = useState(false);
    const [dispatchResult, setDispatchResult] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getVehicles(), getDrivers()])
            .then(([v, d]) => {
                setVehicles(Array.isArray(v) ? v : []);
                setDrivers(Array.isArray(d) ? d : []);
            })
            .catch(console.error);
    }, []);

    const handleRecommend = async (data: {
        vehicleId: number;
        driverId: number;
        cargoWeight: number;
    }) => {
        setRecommending(true);
        setRecommendation(null);
        setDispatchResult(null);
        try {
            const res = await recommendAssignment(data);
            setRecommendation(res);
        } catch (err) {
            console.error("Recommend error:", err);
        } finally {
            setRecommending(false);
        }
    };

    const handleDispatch = async (data: {
        vehicleId: number;
        driverId: number;
        cargoWeight: number;
        distance: number;
    }) => {
        setDispatching(true);
        setDispatchResult(null);
        try {
            await createTrip(data);
            setDispatchResult("Trip dispatched successfully.");
            setRecommendation(null);
        } catch (err) {
            console.error("Dispatch error:", err);
            setDispatchResult("Failed to dispatch trip.");
        } finally {
            setDispatching(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left: Form */}
                <TripForm
                    vehicles={vehicles}
                    drivers={drivers}
                    onRecommend={handleRecommend}
                    onDispatch={handleDispatch}
                    recommending={recommending}
                    dispatching={dispatching}
                />

                {/* Right: Recommendation result */}
                <div className="space-y-4">
                    <RecommendationCard data={recommendation} />

                    {dispatchResult && (
                        <div
                            className={`rounded-lg border px-4 py-3 text-sm font-medium ${dispatchResult.includes("success")
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                                }`}
                        >
                            {dispatchResult}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
