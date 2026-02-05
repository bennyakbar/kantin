'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function tambahStok(barangId: string, qty: number) {
    const supabase = await createClient()

    const { data: barang } = await supabase
        .from('barang')
        .select('stok')
        .eq('id', barangId)
        .single()

    if (!barang) throw new Error('Barang tidak ditemukan')

    const { error } = await supabase
        .from('barang')
        .update({
            stok: barang.stok + qty,
            updated_at: new Date().toISOString()
        })
        .eq('id', barangId)

    if (error) throw new Error(error.message)
    revalidatePath('/barang')
    revalidatePath('/inventory')
}

export async function addPengeluaran(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('pengeluaran').insert({
        user_id: user?.id,
        kategori: formData.get('kategori'),
        keterangan: formData.get('keterangan'),
        jumlah: Number(formData.get('jumlah')),
    })

    if (error) throw new Error(error.message)
    revalidatePath('/pengeluaran')
}
