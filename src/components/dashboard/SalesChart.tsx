'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function SalesChart({ data }: { data: { date: string; omzet: number }[] }) {
    // Format date for display (e.g., "05 Feb")
    const formattedData = data.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    }))

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="displayDate"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`}
                    />
                    {/* <Tooltip
                        formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omzet']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    /> */}
                    <Bar
                        dataKey="omzet"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
