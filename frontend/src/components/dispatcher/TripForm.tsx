"use client";

import React, { useState } from "react";

interface Vehicle {
    id: number;
    model: string;
    licensePlate?: string;
}

interface Driver {
    id: number;
    name: string;
    licenseExpiryDate?: string;
}

interface TripFormProps {
    vehicles: Vehicle[];
    drivers: Driver[];
    onRecommend: (data: {
        vehicleId: number;
        driverId: number;
        cargoWeight: number;
    }) => void;
    onDispatch: (data: {
        vehicleId: number;
        driverId: number;
        cargoWeight: number;
        distance: number;
    }) => void;
    recommending: boolean;
    dispatching: boolean;
}

export default function TripForm({
    vehicles,
    drivers,
    onRecommend,
    onDispatch,
    recommending,
    dispatching,
}: TripFormProps) {
    const [vehicleId, setVehicleId] = useState("");
    const [driverId, setDriverId] = useState("");
    const [cargoWeight, setCargoWeight] = useState("");
    const [distance, setDistance] = useState("");

    const canRecommend = vehicleId && driverId && cargoWeight;
    const canDispatch = vehicleId && driverId && cargoWeight && distance;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
                New Trip Assignment
            </h2>

            <div className="space-y-4">
                {/* Vehicle */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle
                    </label>
                    <select
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                    >
                        <option value="">Select a vehicle</option>
                        {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.model} {v.licensePlate ? `(${v.licensePlate})` : `#${v.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Driver */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver
                    </label>
                    <select
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                    >
                        <option value="">Select a driver</option>
                        {drivers.map((d) => {
                            const isExpired = !!(d.licenseExpiryDate && new Date(d.licenseExpiryDate) < new Date());
                            return (
                                <option key={d.id} value={d.id} disabled={isExpired}>
                                    {d.name} {isExpired ? "(LICENSE EXPIRED)" : ""}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Cargo Weight */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cargo Weight (kg)
                    </label>
                    <input
                        type="number"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                    />
                </div>

                {/* Distance */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Distance (km)
                    </label>
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="e.g. 350"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() =>
                            onRecommend({
                                vehicleId: Number(vehicleId),
                                driverId: Number(driverId),
                                cargoWeight: Number(cargoWeight),
                            })
                        }
                        disabled={!canRecommend || recommending}
                        className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {recommending ? "Checking..." : "Get Recommendation"}
                    </button>
                    <button
                        onClick={() =>
                            onDispatch({
                                vehicleId: Number(vehicleId),
                                driverId: Number(driverId),
                                cargoWeight: Number(cargoWeight),
                                distance: Number(distance),
                            })
                        }
                        disabled={!canDispatch || dispatching}
                        className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {dispatching ? "Dispatching..." : "Dispatch Trip"}
                    </button>
                </div>
            </div>
        </div>
    );
}
