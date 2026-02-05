import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { PengeluaranForm } from './pengeluaran-form'

export default async function PengeluaranPage() {
    await requireRole(['canteen_keeper'])
    const supabase = await createClient()

    const { data: list } = await supabase
        .from('pengeluaran')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

    const total = list?.reduce((sum, p) => sum + p.jumlah, 0) || 0

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Pengeluaran</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Tambah Pengeluaran</h2>
                    <PengeluaranForm />
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Riwayat Pengeluaran</h2>
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <span className="text-gray-600">Total: </span>
                            <span className="font-bold text-red-600">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Tanggal</th>
                                    <th className="px-4 py-2 text-left">Kategori</th>
                                    <th className="px-4 py-2 text-left">Keterangan</th>
                                    <th className="px-4 py-2 text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list?.map((p) => (
                                    <tr key={p.id} className="border-t">
                                        <td className="px-4 py-2 text-sm">{new Date(p.tanggal).toLocaleDateString('id-ID')}</td>
                                        <td className="px-4 py-2 text-sm capitalize">{p.kategori.replace('_', ' ')}</td>
                                        <td className="px-4 py-2 text-sm">{p.keterangan}</td>
                                        <td className="px-4 py-2 text-right text-red-600">Rp {p.jumlah.toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                                {(!list || list.length === 0) && (
                                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Belum ada pengeluaran</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
