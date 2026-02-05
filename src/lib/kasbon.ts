import { createClient } from '@/lib/supabase/client'

// Client-side functions for interactivity
export async function addKasbon(nama: string, nominal: number, keterangan: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('kasbon')
        .insert({ nama_peminjam: nama, nominal, keterangan })

    if (error) throw error
}

export async function markLunas(id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('kasbon')
        .update({ status: 'lunas', updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw error
}

export async function deleteKasbon(id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('kasbon')
        .delete()
        .eq('id', id)

    if (error) throw error
}
