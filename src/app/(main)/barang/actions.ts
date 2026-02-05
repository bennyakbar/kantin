'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBarang(formData: FormData) {
    const supabase = await createClient()
    const { error } = await supabase.from('barang').insert({
        nama_barang: formData.get('nama_barang'),
        kategori: formData.get('kategori'),
        satuan: formData.get('satuan'),
        harga_modal: Number(formData.get('harga_modal')),
        harga_jual: Number(formData.get('harga_jual')),
        stok: Number(formData.get('stok')),
        status: 'aktif',
    })
    if (error) throw new Error(error.message)
    revalidatePath('/barang')
}

export async function updateBarang(id: string, formData: FormData) {
    const supabase = await createClient()
    const { error } = await supabase.from('barang').update({
        nama_barang: formData.get('nama_barang'),
        kategori: formData.get('kategori'),
        satuan: formData.get('satuan'),
        harga_modal: Number(formData.get('harga_modal')),
        harga_jual: Number(formData.get('harga_jual')),
        stok: Number(formData.get('stok')),
        updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/barang')
}

export async function updateStok(id: string, stok: number) {
    const supabase = await createClient()
    const { error } = await supabase.from('barang').update({ stok, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/barang')
}

export async function toggleBarangStatus(id: string, currentStatus: string) {
    const supabase = await createClient()
    const newStatus = currentStatus === 'aktif' ? 'nonaktif' : 'aktif'
    const { error } = await supabase.from('barang').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/barang')
}
