import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BarangForm } from '../barang-form'
import { Barang } from '@/types'

export default async function EditBarangPage({ params }: { params: Promise<{ id: string }> }) {
    await requireRole(['canteen_keeper'])
    const { id } = await params
    const supabase = await createClient()
    const { data: barang } = await supabase.from('barang').select('*').eq('id', id).single()
    if (!barang) notFound()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Barang</h1>
            <BarangForm barang={barang as Barang} />
        </div>
    )
}
