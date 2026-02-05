'use client'

import { ReportSummary } from '@/lib/reports'

export function ReportTable({ data, period, title }: { data: ReportSummary; period: string; title?: string }) {
    function handlePrint() {
        window.print()
    }

    function handleExportCSV() {
        const rows = [
            ['Laporan', title || period],
            ['Tanggal Cetak', new Date().toLocaleDateString('id-ID')],
            [''],
            ['RINGKASAN'],
            ['Total Transaksi', data.totalTransactions],
            ['Total Omzet', data.totalOmzet],
            ['Total Modal', data.totalModal],
            ['Total Laba', data.totalLaba],
            [''],
            ['PER KATEGORI'],
            ['Kategori', 'Qty', 'Omzet'],
            ...data.byKategori.map(k => [k.kategori, k.qty, k.omzet]),
            [''],
            ['RINCIAN PENJUALAN'],
            ['Nama Barang', 'Kategori', 'Qty', 'Subtotal'],
            ...data.itemsSold.map(i => [i.nama_barang, i.kategori, i.qty, i.subtotal]),
            [''],
            ['STOK AKHIR'],
            ['Nama Barang', 'Kategori', 'Stok'],
            ...data.endingStock.map(s => [s.nama_barang, s.kategori, s.stok])
        ]

        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `laporan_${period}_${new Date().getTime()}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-end gap-2 no-print">
                <button
                    onClick={handleExportCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold flex items-center gap-2"
                >
                    <span>📊</span> Export Excel
                </button>
                <button
                    onClick={handlePrint}
                    style={{ backgroundColor: '#353535' }}
                    className="text-white px-4 py-2 rounded hover:opacity-80 transition font-semibold flex items-center gap-2"
                >
                    <span>🖨️</span> Print / PDF
                </button>
            </div>

            {/* Print Header - visible only when printing */}
            <div className="print-only text-center mb-6" style={{ display: 'none' }}>
                <h1 className="text-2xl font-bold">MTW Nurul Falah</h1>
                <h2 className="text-lg">{title || `Laporan ${period}`}</h2>
                <p className="text-sm text-gray-600">Dicetak: {new Date().toLocaleDateString('id-ID')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-gray-600 text-sm">Total Transaksi</h3>
                    <p className="text-2xl font-bold">{data.totalTransactions}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-gray-600 text-sm">Total Omzet</h3>
                    <p className="text-2xl font-bold" style={{ color: '#007235' }}>Rp {data.totalOmzet.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-gray-600 text-sm">Total Modal</h3>
                    <p className="text-2xl font-bold text-gray-600">Rp {data.totalModal.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-gray-600 text-sm">Total Laba</h3>
                    <p className={`text-2xl font-bold ${data.totalLaba >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rp {data.totalLaba.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            {data.byKategori.length > 0 && (
                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <h3 className="p-4 font-semibold border-b bg-gray-50">Per Kategori</h3>
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold">Kategori</th>
                                <th className="px-4 py-3 text-right font-bold">Qty</th>
                                <th className="px-4 py-3 text-right font-bold">Omzet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.byKategori.map((k, i) => (
                                <tr key={i} className="border-t">
                                    <td className="px-4 py-3 capitalize">{k.kategori}</td>
                                    <td className="px-4 py-3 text-right">{k.qty}</td>
                                    <td className="px-4 py-3 text-right">Rp {k.omzet.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <h3 className="p-4 font-semibold border-b bg-gray-50">Barang Terjual</h3>
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-bold">Nama Barang</th>
                            <th className="px-4 py-3 text-center font-bold">Kategori</th>
                            <th className="px-4 py-3 text-right font-bold">Qty</th>
                            <th className="px-4 py-3 text-right font-bold">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.itemsSold.map((item, i) => (
                            <tr key={i} className="border-t">
                                <td className="px-4 py-3">{item.nama_barang}</td>
                                <td className="px-4 py-3 text-center capitalize">{item.kategori}</td>
                                <td className="px-4 py-3 text-right">{item.qty}</td>
                                <td className="px-4 py-3 text-right">Rp {item.subtotal.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        {data.itemsSold.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-500">Tidak ada penjualan</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <h3 className="p-4 font-semibold border-b bg-gray-50">Stok Akhir</h3>
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-bold">Nama Barang</th>
                            <th className="px-4 py-3 text-center font-bold">Kategori</th>
                            <th className="px-4 py-3 text-right font-bold">Stok</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.endingStock.map((item, i) => (
                            <tr key={i} className="border-t">
                                <td className="px-4 py-3">{item.nama_barang}</td>
                                <td className="px-4 py-3 text-center capitalize">{item.kategori}</td>
                                <td className="px-4 py-3 text-right">{item.stok}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Print Footer */}
            <div className="print-only text-center mt-8 pt-4 border-t" style={{ display: 'none' }}>
                <p className="text-sm text-gray-500">MTW Nurul Falah - Sistem Kantin</p>
            </div>
        </div>
    )
}
