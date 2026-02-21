import React from "react";
import Card from "./Card";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
}

export default function StatCard({ title, value, description }: StatCardProps) {
    return (
        <Card>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
            {description && (
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            )}
        </Card>
    );
}
