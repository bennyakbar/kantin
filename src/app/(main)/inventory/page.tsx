import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { getKategori } from '../kategori/actions'

export default async function InventoryPage() {
    await requireAuth()
    const supabase = await createClient()
    const categories = await getKategori()

    const { data: barangList } = await supabase
        .from('barang')
        .select('*')
        .order('kategori')
        .order('nama_barang')

    const items = barangList || []

    // Calculate summaries
    const totalItems = items.length
    const totalStok = items.reduce((sum, b) => sum + b.stok, 0)
    const totalNilaiModal = items.reduce((sum, b) => sum + (b.harga_modal || 0) * b.stok, 0)
    const totalNilaiJual = items.reduce((sum, b) => sum + b.harga_jual * b.stok, 0)
    const lowStockItems = items.filter(b => b.stok <= 5 && b.status === 'aktif')

    // Group by kategori
    const byKategori = categories.map(k => ({
        label: k.nama,
        value: k.nama,
        items: items.filter(b => b.kategori === k.nama),
        totalStok: items.filter(b => b.kategori === k.nama).reduce((sum, b) => sum + b.stok, 0),
        nilaiJual: items.filter(b => b.kategori === k.nama).reduce((sum, b) => sum + b.harga_jual * b.stok, 0),
    }))

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Inventory Overview</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm">Total Jenis Barang</h3>
                    <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm">Total Stok</h3>
                    <p className="text-2xl font-bold">{totalStok.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm">Nilai Modal</h3>
                    <p className="text-2xl font-bold text-gray-600">Rp {totalNilaiModal.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm">Nilai Jual</h3>
                    <p className="text-2xl font-bold text-blue-600">Rp {totalNilaiJual.toLocaleString('id-ID')}</p>
                </div>
            </div>

            {/* Low Stock Warning */}
            {lowStockItems.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Stok Rendah (≤ 5)</h3>
                    <div className="flex flex-wrap gap-2">
                        {lowStockItems.map(b => (
                            <span key={b.id} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">
                                {b.nama_barang}: {b.stok} {b.satuan}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Per Kategori */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {byKategori.map(k => (
                    <div key={k.value} className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold text-lg mb-2">{k.label}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>Jumlah Item: <span className="font-semibold text-gray-900">{k.items.length}</span></p>
                            <p>Total Stok: <span className="font-semibold text-gray-900">{k.totalStok.toLocaleString('id-ID')}</span></p>
                            <p>Nilai Jual: <span className="font-semibold text-blue-600">Rp {k.nilaiJual.toLocaleString('id-ID')}</span></p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <h3 className="p-4 font-semibold border-b">Daftar Lengkap Inventory</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">Nama Barang</th>
                                <th className="px-4 py-3 text-center">Kategori</th>
                                <th className="px-4 py-3 text-center">Satuan</th>
                                <th className="px-4 py-3 text-right">Stok</th>
                                <th className="px-4 py-3 text-right">Harga Modal</th>
                                <th className="px-4 py-3 text-right">Harga Jual</th>
                                <th className="px-4 py-3 text-right">Nilai Stok</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((b) => (
                                <tr key={b.id} className={`border-t ${b.stok <= 5 && b.status === 'aktif' ? 'bg-yellow-50' : ''}`}>
                                    <td className="px-4 py-3">{b.nama_barang}</td>
                                    <td className="px-4 py-3 text-center capitalize">{b.kategori}</td>
                                    <td className="px-4 py-3 text-center capitalize">{b.satuan}</td>
                                    <td className={`px-4 py-3 text-right font-semibold ${b.stok <= 5 ? 'text-red-600' : ''}`}>{b.stok}</td>
                                    <td className="px-4 py-3 text-right">Rp {(b.harga_modal || 0).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 text-right">Rp {b.harga_jual.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 text-right font-semibold">Rp {(b.harga_jual * b.stok).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs ${b.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
