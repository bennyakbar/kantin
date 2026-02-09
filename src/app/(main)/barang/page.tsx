import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Barang } from '@/types'
import { BarangTable } from './barang-table'

import { getKategori } from '../kategori/actions'

export default async function BarangPage() {
    await requireRole(['canteen_keeper'])
    const supabase = await createClient()
    const categories = await getKategori()
    const { data: barangList } = await supabase.from('barang').select('*').order('nama_barang')

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Master Barang</h1>
                <div className="flex gap-2">
                    <Link href="/barang/import" style={{ backgroundColor: '#007235' }} className="text-white px-4 py-2 rounded hover:opacity-80 transition">📥 Import CSV</Link>
                    <Link href="/barang/tambah" style={{ backgroundColor: '#353535' }} className="text-white px-4 py-2 rounded hover:opacity-80 transition">+ Tambah Barang</Link>
                </div>
            </div>
            <BarangTable barangList={barangList as Barang[] || []} categories={categories} />
        </div>
    )
}
