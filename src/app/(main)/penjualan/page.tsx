import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { SalesForm } from './sales-form'
import { SalesList } from './sales-list'

export default async function PenjualanPage() {
    await requireRole(['canteen_keeper'])
    const supabase = await createClient()

    const { data: barangList } = await supabase
        .from('barang')
        .select('*')
        .eq('status', 'aktif')
        .order('nama_barang')

    const today = new Date().toISOString().split('T')[0]
    const { data: { user } } = await supabase.auth.getUser()

    const { data: penjualan } = await supabase
        .from('penjualan')
        .select('*, detail_penjualan(*, barang(nama_barang))')
        .eq('tanggal', today)
        .eq('user_id', user?.id)
        .single()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Input Penjualan</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Tambah Penjualan</h2>
                    <SalesForm barangList={barangList || []} isClosed={penjualan?.is_closed || false} />
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Penjualan Hari Ini</h2>
                    <SalesList
                        details={penjualan?.detail_penjualan || []}
                        totalOmzet={penjualan?.total_omzet || 0}
                        isClosed={penjualan?.is_closed || false}
                    />
                </div>
            </div>
        </div>
    )
}
