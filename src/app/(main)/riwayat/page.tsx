import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function RiwayatPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>
}) {
    await requireAuth()
    const supabase = await createClient()
    const params = await searchParams
    const today = new Date().toISOString().split('T')[0]
    const date = params.date || today

    const { data: details } = await supabase
        .from('detail_penjualan')
        .select(`
      id,
      qty,
      subtotal,
      created_at,
      barang:barang_id(nama_barang, satuan)
    `)
        .gte('created_at', `${date}T00:00:00`)
        .lt('created_at', `${date}T23:59:59`)
        .order('created_at', { ascending: false })

    const total = details?.reduce((sum, d) => sum + d.subtotal, 0) || 0

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

            <form className="mb-6 flex gap-4 items-end">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={date}
                        max={today}
                        className="p-2 border border-gray-300 rounded text-gray-900 bg-white"
                    />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Lihat
                </button>
            </form>

            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex justify-between">
                    <span className="text-gray-600">Tanggal: <b>{date}</b></span>
                    <span className="font-bold text-blue-600">Total: Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Waktu</th>
                            <th className="px-4 py-3 text-left">Barang</th>
                            <th className="px-4 py-3 text-right">Qty</th>
                            <th className="px-4 py-3 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details?.map((d: any) => (
                            <tr key={d.id} className="border-t">
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {new Date(d.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-4 py-3">{d.barang?.nama_barang}</td>
                                <td className="px-4 py-3 text-right">{d.qty} {d.barang?.satuan}</td>
                                <td className="px-4 py-3 text-right">Rp {d.subtotal.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        {(!details || details.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                    Tidak ada transaksi pada tanggal ini
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
