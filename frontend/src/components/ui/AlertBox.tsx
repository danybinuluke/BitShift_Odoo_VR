import React from "react";
import { AlertTriangle, XCircle, Info } from "lucide-react";

type AlertType = "warning" | "danger" | "info";

interface AlertBoxProps {
    type: AlertType;
    message: string;
    timestamp?: string;
}

const config: Record<
    AlertType,
    { icon: React.ElementType; bg: string; border: string; text: string; iconColor: string }
> = {
    warning: {
        icon: AlertTriangle,
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        iconColor: "text-yellow-500",
    },
    danger: {
        icon: XCircle,
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        iconColor: "text-red-500",
    },
    info: {
        icon: Info,
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        iconColor: "text-blue-500",
    },
};

export default function AlertBox({ type, message, timestamp }: AlertBoxProps) {
    const { icon: Icon, bg, border, text, iconColor } = config[type];

    return (
        <div
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${bg} ${border}`}
        >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
                <p className={`text-sm ${text}`}>{message}</p>
                {timestamp && (
                    <p className="mt-0.5 text-xs text-gray-400">
                        {new Date(timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                )}
            </div>
        </div>
    );
}
