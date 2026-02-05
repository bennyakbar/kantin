import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { RestokForm } from './restok-form'
import { Barang } from '@/types'

export default async function RestokPage() {
    await requireRole(['canteen_keeper'])
    const supabase = await createClient()

    const { data: barangList } = await supabase
        .from('barang')
        .select('*')
        .eq('status', 'aktif')
        .order('nama_barang')

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Restok Barang</h1>
            <RestokForm barangList={barangList as Barang[] || []} />
        </div>
    )
}
