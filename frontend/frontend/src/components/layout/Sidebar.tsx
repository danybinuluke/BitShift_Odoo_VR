"use client";

import React from "react";
import StaggeredMenu from "@/components/StaggeredMenu";
import { useRole } from "@/context/RoleContext";
import { getSidebarForRole } from "@/config/rbac";

export default function Sidebar() {
    const { role } = useRole();
    const visibleItems = getSidebarForRole(role);

    const navItems = visibleItems.map((item) => ({
        label: item.label,
        ariaLabel: `Go to ${item.label}`,
        link: item.path,
    }));

    return (
        <StaggeredMenu
            isFixed={true}
            position="left"
            items={navItems}
            displayItemNumbering={true}
            menuButtonColor="#000"
            openMenuButtonColor="#000"
            accentColor="#3b82f6"
            colors={["#f8fafc", "#f1f5f9"]}
        />
    );
}
