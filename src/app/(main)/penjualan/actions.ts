'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function processTransaction(items: { barangId: string; qty: number }[]) {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Get or Create Daily Sales Record
    let { data: penjualan } = await supabase
        .from('penjualan')
        .select('*')
        .eq('tanggal', today)
        .eq('user_id', user?.id)
        .single()

    if (!penjualan) {
        const { data: newPenjualan, error: createError } = await supabase
            .from('penjualan')
            .insert({ tanggal: today, user_id: user?.id, total_transaksi: 0, total_omzet: 0 })
            .select()
            .single()
        if (createError) throw new Error(createError.message)
        penjualan = newPenjualan
    }

    if (penjualan.is_closed) throw new Error('Penjualan hari ini sudah ditutup')

    // 2. Validate Stock and Calculate Totals
    let totalSubtotal = 0
    const detailsToInsert = []

    for (const item of items) {
        const { data: barang } = await supabase
            .from('barang')
            .select('*')
            .eq('id', item.barangId)
            .single()

        if (!barang) throw new Error(`Barang ID ${item.barangId} tidak ditemukan`)
        if (barang.stok < item.qty) throw new Error(`Stok ${barang.nama_barang} kurang (Sisa: ${barang.stok})`)

        const subtotal = barang.harga_jual * item.qty
        totalSubtotal += subtotal

        detailsToInsert.push({
            penjualan_id: penjualan.id,
            barang_id: item.barangId,
            qty: item.qty,
            subtotal,
            harga_modal: (barang.harga_modal || 0) * item.qty
        })

        // Decrease Stock
        await supabase.from('barang').update({ stok: barang.stok - item.qty }).eq('id', item.barangId)
    }

    // 3. Insert Details
    const { error: detailError } = await supabase
        .from('detail_penjualan')
        .insert(detailsToInsert)

    if (detailError) throw new Error(detailError.message)

    // 4. Update Daily Totals (Count Transaction + 1 for the whole batch)
    await supabase.from('penjualan').update({
        total_transaksi: penjualan.total_transaksi + 1,
        total_omzet: penjualan.total_omzet + totalSubtotal
    }).eq('id', penjualan.id)

    revalidatePath('/penjualan')
    revalidatePath('/dashboard')
}

export async function closeSales() {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('penjualan')
        .update({ is_closed: true })
        .eq('tanggal', today)
        .eq('user_id', user?.id)

    if (error) throw new Error(error.message)
    revalidatePath('/penjualan')
    revalidatePath('/dashboard')
}
