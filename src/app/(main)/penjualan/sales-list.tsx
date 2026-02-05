'use client'

import { closeSales } from './actions'
import { useState } from 'react'

interface SalesDetail {
    id: string
    qty: number
    subtotal: number
    barang: { nama_barang: string }
}

export function SalesList({ details, totalOmzet, isClosed }: {
    details: SalesDetail[]
    totalOmzet: number
    isClosed: boolean
}) {
    const [loading, setLoading] = useState(false)

    async function handleClose() {
        if (!confirm('Yakin ingin menutup penjualan hari ini? Data tidak bisa diubah lagi.')) return
        setLoading(true)
        try {
            await closeSales()
        } catch (e) {
            alert((e as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
                <span className="font-semibold">Total: Rp {totalOmzet.toLocaleString('id-ID')}</span>
                {!isClosed && details.length > 0 && (
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? 'Menutup...' : 'Tutup Hari'}
                    </button>
                )}
                {isClosed && (
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm">Ditutup</span>
                )}
            </div>

            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left">Barang</th>
                        <th className="px-4 py-2 text-right">Qty</th>
                        <th className="px-4 py-2 text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((d) => (
                        <tr key={d.id} className="border-t">
                            <td className="px-4 py-2">{d.barang?.nama_barang}</td>
                            <td className="px-4 py-2 text-right">{d.qty}</td>
                            <td className="px-4 py-2 text-right">Rp {d.subtotal.toLocaleString('id-ID')}</td>
                        </tr>
                    ))}
                    {details.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                Belum ada penjualan hari ini
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
