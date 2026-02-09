'use client'

import Link from 'next/link'

export function StockAlert({ items }: { items: { nama_barang: string; stok: number }[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2">
                <span>✅</span> Semua stok aman terkendali.
            </div>
        )
    }

    return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg overflow-hidden">
            <div className="bg-orange-100 p-3 border-b border-orange-200 flex justify-between items-center">
                <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                    ⚠️ Stok Menipis ({"<"} 5)
                </h3>
                <Link href="/stok" className="text-sm bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition">
                    Restok Sekarang
                </Link>
            </div>
            <ul className="divide-y divide-orange-200">
                {items.map((item, i) => (
                    <li key={i} className="p-3 flex justify-between items-center hover:bg-orange-100/50 transition">
                        <span className="text-gray-800 font-medium">{item.nama_barang}</span>
                        <span className="text-red-600 font-bold bg-white px-2 py-0.5 rounded border border-red-200 text-sm">
                            Sisa: {item.stok}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
