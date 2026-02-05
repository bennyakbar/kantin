import { requireAuth, isKeeper } from '@/lib/auth'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSalesTrend } from '@/lib/reports'
import { SalesChart } from '@/components/dashboard/SalesChart'

export default async function DashboardPage() {
    const user = await requireAuth()
    const supabase = await createClient()
    const keeper = isKeeper(user.role)

    const today = new Date().toISOString().split('T')[0]

    const { count: todaySales } = await supabase
        .from('detail_penjualan')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

    const { data: todayTotal } = await supabase
        .from('penjualan')
        .select('total_omzet')
        .eq('tanggal', today)
        .single()

    const trendData = await getSalesTrend(7)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Dashboard {keeper ? 'Penjaga' : 'Yayasan'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-600">Transaksi Hari Ini</h2>
                    <p className="text-3xl font-bold">{todaySales || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-600">Omzet Hari Ini</h2>
                    <p className="text-3xl font-bold">
                        Rp {(todayTotal?.total_omzet || 0).toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            {/* Sales Chart Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Tren Penjualan (7 Hari Terakhir)</h2>
                <SalesChart data={trendData} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {keeper && (
                    <>
                        <Link href="/penjualan" className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700">
                            Input Penjualan
                        </Link>
                        <Link href="/barang" className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700">
                            Master Barang
                        </Link>
                        <Link href="/kasbon" className="bg-red-600 text-white p-4 rounded-lg text-center hover:bg-red-700">
                            Buku Kasbon
                        </Link>
                    </>
                )}
                <Link href="/laporan" className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700">
                    Laporan
                </Link>
            </div>
        </div>
    )
}
