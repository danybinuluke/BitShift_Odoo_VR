import React from "react";

interface DataTableProps {
    headers: string[];
    rows: (string | React.ReactNode)[][];
}

export default function DataTable({ headers, rows }: DataTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-gray-200">
                        {headers.map((header, i) => (
                            <th
                                key={i}
                                className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                        >
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-3 text-gray-700">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
