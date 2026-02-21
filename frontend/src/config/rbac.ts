/* ─────────────────────────────────────────────────────────
 * FleetFlow – Role-Based Access Control (frontend-only)
 *
 * ⚠️  Temporary hardcoded config.
 *     Will be replaced by backend auth later.
 * ────────────────────────────────────────────────────── */

export type Role = "Manager" | "Dispatcher" | "Safety" | "Financial";

/* ── Permission matrix ─────────────────────────────────── */
export const permissions: Record<
    Role,
    {
        canAddVehicle: boolean;
        canAddDriver: boolean;
        canDispatch: boolean;
        canAddMaintenance: boolean;
        canViewExpenses: boolean;
        canViewAnalytics: boolean;
    }
> = {
    Manager: {
        canAddVehicle: true,
        canAddDriver: true,
        canDispatch: true,
        canAddMaintenance: true,
        canViewExpenses: true,
        canViewAnalytics: true,
    },
    Dispatcher: {
        canAddVehicle: false,
        canAddDriver: false,
        canDispatch: true,
        canAddMaintenance: false,
        canViewExpenses: false,
        canViewAnalytics: false,
    },
    Safety: {
        canAddVehicle: false,
        canAddDriver: false,
        canDispatch: false,
        canAddMaintenance: true,
        canViewExpenses: false,
        canViewAnalytics: true,
    },
    Financial: {
        canAddVehicle: false,
        canAddDriver: false,
        canDispatch: false,
        canAddMaintenance: false,
        canViewExpenses: true,
        canViewAnalytics: true,
    },
};

/* ── Sidebar items with role visibility ────────────────── */
export interface SidebarItem {
    label: string;
    path: string;
    roles: Role[];
}

export const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", path: "/dashboard", roles: ["Manager", "Dispatcher", "Safety", "Financial"] },
    { label: "Vehicles", path: "/vehicles", roles: ["Manager", "Dispatcher", "Safety"] },
    { label: "Drivers", path: "/drivers", roles: ["Manager", "Dispatcher", "Safety"] },
    { label: "Dispatcher", path: "/dispatcher", roles: ["Manager", "Dispatcher"] },
    { label: "Maintenance", path: "/maintenance", roles: ["Manager", "Safety"] },
    { label: "Expenses", path: "/expenses", roles: ["Manager", "Financial"] },
    { label: "Analytics", path: "/analytics", roles: ["Manager", "Safety", "Financial"] },
];

/* ── Helper: filter sidebar for a given role ───────────── */
export function getSidebarForRole(role: Role): SidebarItem[] {
    return sidebarItems.filter((item) => item.roles.includes(role));
}

/* ── Helper: check if role can access a path ───────────── */
export function canAccessPath(role: Role, path: string): boolean {
    const item = sidebarItems.find((i) => i.path === path);
    if (!item) return true; // unlisted paths are accessible
    return item.roles.includes(role);
}
