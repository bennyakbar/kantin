import { requireAuth, isKeeper } from '@/lib/auth'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSalesTrend, getTopCategories, getLowStockItems } from '@/lib/reports'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { StockAlert } from '@/components/dashboard/StockAlert'

export default async function DashboardPage() {
    const user = await requireAuth()
    const supabase = await createClient()
    const keeper = isKeeper(user.role)

    const today = new Date().toISOString().split('T')[0]

    // Calculate start date for "Last 30 Days" for Pie Chart
    const pieStartDate = new Date()
    pieStartDate.setDate(pieStartDate.getDate() - 30)
    const pieStartDateStr = pieStartDate.toISOString().split('T')[0]

    const { count: todaySales } = await supabase
        .from('detail_penjualan')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

    const { data: todayTotal } = await supabase
        .from('penjualan')
        .select('total_omzet')
        .eq('tanggal', today)
        .single()

    // Parallel data fetching
    const [trendData, topCategories, lowStockItems] = await Promise.all([
        getSalesTrend(7),
        getTopCategories(pieStartDateStr, today),
        getLowStockItems(5)
    ])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Dashboard {keeper ? 'Penjaga' : 'Yayasan'}
            </h1>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h2 className="text-gray-600">Transaksi Hari Ini</h2>
                    <p className="text-3xl font-bold">{todaySales || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h2 className="text-gray-600">Omzet Hari Ini</h2>
                    <p className="text-3xl font-bold">
                        Rp {(todayTotal?.total_omzet || 0).toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Content (Charts) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Sales Chart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Tren Penjualan (7 Hari Terakhir)</h2>
                        <SalesChart data={trendData} />
                    </div>

                    {/* Top Categories Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Top 5 Kategori (30 Hari Terakhir)</h2>
                        <CategoryPieChart data={topCategories} />
                    </div>
                </div>

                {/* Sidebar (Alerts & Menu) */}
                <div className="space-y-6">
                    {/* Stock Alert Section */}
                    <StockAlert items={lowStockItems} />

                    {/* Quick Access Menu */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Menu Cepat</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {keeper && (
                                <>
                                    <Link href="/penjualan" className="bg-blue-600 text-white p-3 rounded text-center hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                        🛒 Input Penjualan
                                    </Link>
                                    <Link href="/barang/tambah" className="bg-green-600 text-white p-3 rounded text-center hover:bg-green-700 transition flex items-center justify-center gap-2">
                                        📦 Tambah Barang
                                    </Link>
                                    <Link href="/stok" className="bg-orange-500 text-white p-3 rounded text-center hover:bg-orange-600 transition flex items-center justify-center gap-2">
                                        📋 Cek Stok
                                    </Link>
                                </>
                            )}
                            <Link href="/laporan" className="bg-purple-600 text-white p-3 rounded text-center hover:bg-purple-700 transition flex items-center justify-center gap-2">
                                📈 Lihat Laporan
                            </Link>
                            {!keeper && (
                                <Link href="/kategori" className="bg-gray-600 text-white p-3 rounded text-center hover:bg-gray-700 transition flex items-center justify-center gap-2">
                                    🏷️ Kelola Kategori
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
