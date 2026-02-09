'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface BarangImport {
    nama_barang: string
    kategori: string
    satuan: string
    harga_modal: number
    harga_jual: number
    stok: number
}

import { getKategori } from '../../kategori/actions'

export async function importBarang(items: BarangImport[]) {
    const supabase = await createClient()
    const categories = await getKategori()
    const validCategoryNames = categories.map(c => c.nama)
    const defaultCategory = validCategoryNames[0] || 'snack'

    const validItems = items.map(item => ({
        nama_barang: item.nama_barang,
        kategori: validCategoryNames.includes(item.kategori) ? item.kategori : defaultCategory,
        satuan: ['pcs', 'bungkus', 'botol', 'porsi', 'cup', 'kotak'].includes(item.satuan) ? item.satuan : 'pcs',
        harga_modal: Math.max(0, Number(item.harga_modal) || 0),
        harga_jual: Math.max(0, Number(item.harga_jual) || 0),
        stok: Math.max(0, Number(item.stok) || 0),
        status: 'aktif'
    }))

    const { error } = await supabase.from('barang').insert(validItems)

    if (error) throw new Error(error.message)

    revalidatePath('/barang')
    revalidatePath('/inventory')

    return { success: true, count: validItems.length }
}
