const BASE_URL = "http://localhost:5000/api";

// ─── Vehicles ────────────────────────────────────────

export async function getVehicles() {
  const res = await fetch(`${BASE_URL}/vehicles`);
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
}

// ─── Drivers ─────────────────────────────────────────

export async function getDrivers() {
  const res = await fetch(`${BASE_URL}/drivers`);
  if (!res.ok) throw new Error("Failed to fetch drivers");
  return res.json();
}

// ─── Trips ───────────────────────────────────────────

export async function getTrips() {
  const res = await fetch("http://localhost:5000/trip");
  if (!res.ok) {
    throw new Error("Failed to fetch trips");
  }
  return res.json();
}

export async function createTrip(data: {
  vehicleId: number;
  driverId: number;
  cargoWeight: number;
  distance: number;
}) {
  const res = await fetch(`${BASE_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  return res.json();
}

// ─── Intelligence ────────────────────────────────────

export async function getFleetRisk() {
  const res = await fetch(`${BASE_URL}/intelligence/fleet-risk`);
  if (!res.ok) throw new Error("Failed to fetch fleet risk");
  return res.json();
}

export async function recommendAssignment(data: {
  vehicleId: number;
  driverId: number;
  cargoWeight: number;
}) {
  const res = await fetch(`${BASE_URL}/intelligence/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get recommendation");
  return res.json();
}

// ─── Maintenance ─────────────────────────────────────

export async function getMaintenanceLogs() {
  const res = await fetch(`${BASE_URL}/maintenance`);
  if (!res.ok) throw new Error("Failed to fetch maintenance logs");
  return res.json();
}

export async function createMaintenanceLog(data: {
  vehicleId: number;
  type: string;
  description: string;
  cost: number;
  date: string;
}) {
  const res = await fetch(`${BASE_URL}/maintenance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create maintenance log");
  return res.json();
}

// ─── Expenses ────────────────────────────────────────

export async function getExpenses() {
  const res = await fetch(`${BASE_URL}/expenses`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createExpense(data: {
  vehicleId: number;
  category: string;
  amount: number;
  description: string;
  date: string;
}) {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
}
