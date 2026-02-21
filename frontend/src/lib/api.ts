const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fleetflow-backend-hkhw.onrender.com/api";

/**
 * Standardized API Fetch Wrapper
 * Ensures consistent headers and error handling across the entire codebase.
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `API Error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    // Auto-unwrap legacy/nested responses (e.g., { success: true, data: [...] })
    if (json && typeof json === 'object' && 'data' in json) {
      return json.data;
    }

    return json;
  } catch (err) {
    console.error(`Fetch error [${endpoint}]:`, err);
    throw err;
  }
}

// ─── Vehicles ────────────────────────────────────────

export async function getVehicles() {
  const data = await apiFetch("/vehicles");
  return Array.isArray(data) ? data : [];
}

export async function createVehicle(data: {
  model: string;
  licensePlate: string;
  year: number;
  odometer: number;
  fuelType: string;
  type?: string;
  capacity?: number;
}) {
  return apiFetch("/vehicles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteVehicle(id: number) {
  return apiFetch(`/vehicles/${id}`, {
    method: "DELETE",
  });
}

// ─── Drivers ─────────────────────────────────────────

export async function getDrivers() {
  const data = await apiFetch("/drivers");
  return Array.isArray(data) ? data : [];
}

export async function createDriver(data: {
  name: string;
  licenseNumber: string;
  licenseExpiryDate?: string;
  experience?: number;
  phone?: string;
}) {
  return apiFetch("/drivers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Trips ───────────────────────────────────────────

export async function getTrips() {
  const data = await apiFetch("/trips");
  return Array.isArray(data) ? data : [];
}

export async function createTrip(data: {
  vehicleId: number;
  driverId: number;
  cargoWeight: number;
  distance: number;
}) {
  return apiFetch("/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Intelligence ────────────────────────────────────

export async function getFleetRisk() {
  return apiFetch("/intelligence/fleet-risk");
}

export async function getMetrics() {
  return apiFetch("/intelligence/metrics");
}

export async function getProfitMetrics() {
  return apiFetch("/intelligence/profit-metrics");
}

export async function getProfitTrend() {
  try {
    const data = await apiFetch("/intelligence/profit-trend");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("Profit trend endpoint failed, returning empty fallback.", err);
    return [];
  }
}

export async function getAIHealth() {
  return apiFetch("/intelligence/ai-health");
}

export async function getCostPerKm(vehicleId: number) {
  return apiFetch(`/intelligence/cost-per-km/${vehicleId}`);
}

export async function recommendAssignment(data: {
  vehicleId: number;
  driverId: number;
  cargoWeight: number;
}) {
  return apiFetch("/intelligence/recommend", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Maintenance ─────────────────────────────────────

export async function getMaintenanceLogs() {
  try {
    const data = await apiFetch("/maintenance");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("Maintenance logs fetch failed:", err);
    return [];
  }
}

export async function createMaintenanceLog(data: {
  vehicleId: number;
  type: string;
  description: string;
  cost: number;
  date: string;
}) {
  return apiFetch("/maintenance", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── System ──────────────────────────────────────────

export async function getSystemStatus() {
  return apiFetch("/system/status");
}

export async function getApiRoot() {
  return apiFetch("");
}

export async function getHealth() {
  const root = BASE_URL.endsWith("/api") ? BASE_URL.slice(0, -4) : BASE_URL;
  return apiFetch(`${root}/health`);
}
