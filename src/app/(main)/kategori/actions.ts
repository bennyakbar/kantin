'use server'

import { createClient } from '@/lib/supabase/server'
import { KategoriRow } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getKategori() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('kategori')
        .select('*')
        .order('nama', { ascending: true })

    if (error) throw new Error(error.message)
    return data as KategoriRow[]
}

export async function addKategori(nama: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('kategori').insert({ nama })
    if (error) throw new Error(error.message)
    revalidatePath('/kategori')
    revalidatePath('/barang')
    revalidatePath('/inventory')
}

export async function deleteKategori(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('kategori').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/kategori')
    revalidatePath('/barang')
    revalidatePath('/inventory')
}
