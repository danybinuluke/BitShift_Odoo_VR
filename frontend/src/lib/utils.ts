import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Vehicle is unavailable if in maintenance (in shop) or currently on a trip */
export function isVehicleUnavailable(
  vehicle: { id: number; status?: string },
  vehicleIdsOnTrip: Set<number>
): boolean {
  const s = (vehicle.status || "").toLowerCase();
  const inMaintenance =
    s === "maintenance" || s === "in_maintenance" || s === "in service" || s === "in shop";
  const onTrip = s === "on trip" || s === "on_trip" || vehicleIdsOnTrip.has(vehicle.id);
  return inMaintenance || onTrip;
}

/** Filter vehicles to only those available for dispatch (not in maintenance, not on trip) */
export function getAvailableVehicles<T extends { id: number; status?: string }>(
  vehicles: T[],
  trips: { vehicleId: number; status?: string }[]
): T[] {
  const activeTripStatuses = ["on_trip", "on trip", "in_progress"];
  const vehicleIdsOnTrip = new Set(
    trips
      .filter((t) => activeTripStatuses.includes((t.status || "").toLowerCase()))
      .map((t) => t.vehicleId)
  );
  return vehicles.filter((v) => !isVehicleUnavailable(v, vehicleIdsOnTrip));
}
