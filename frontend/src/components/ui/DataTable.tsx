import React from "react";

interface DataTableProps {
    headers: string[];
    rows: (string | React.ReactNode)[][];
}

export default function DataTable({ headers, rows }: DataTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">

                    {/* Header */}
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                        <tr>
                            {headers.map((header, i) => (
                                <th
                                    key={i}
                                    className="px-6 py-4 font-semibold"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-gray-100">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="px-6 py-6 text-center text-sm text-gray-500"
                                >
                                    No data available.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="transition hover:bg-gray-50"
                                >
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-6 py-5 text-gray-700"
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}