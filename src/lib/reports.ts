import { createClient } from '@/lib/supabase/server'

export interface ReportSummary {
    totalTransactions: number
    totalOmzet: number
    totalModal: number
    totalLaba: number
    itemsSold: { nama_barang: string; kategori: string; qty: number; subtotal: number }[]
    byKategori: { kategori: string; qty: number; omzet: number }[]
    endingStock: { nama_barang: string; kategori: string; stok: number }[]
}

export async function getDailyReport(date: string): Promise<ReportSummary> {
    const supabase = await createClient()

    const { data: penjualan } = await supabase
        .from('penjualan')
        .select('total_transaksi, total_omzet')
        .eq('tanggal', date)
        .single()

    const { data: details } = await supabase
        .from('detail_penjualan')
        .select(`qty, subtotal, harga_modal, barang:barang_id(nama_barang, kategori)`)
        .gte('created_at', `${date}T00:00:00`)
        .lt('created_at', `${date}T23:59:59`)

    const { data: barang } = await supabase
        .from('barang')
        .select('nama_barang, kategori, stok')
        .eq('status', 'aktif')
        .order('nama_barang')

    let totalModal = 0
    const itemsMap = new Map<string, { kategori: string; qty: number; subtotal: number }>()
    const kategoriMap = new Map<string, { qty: number; omzet: number }>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?.forEach((d: any) => {
        const nama = d.barang?.nama_barang || 'Unknown'
        const kategori = d.barang?.kategori || 'snack'
        totalModal += d.harga_modal || 0

        const existing = itemsMap.get(nama) || { kategori, qty: 0, subtotal: 0 }
        itemsMap.set(nama, { kategori, qty: existing.qty + d.qty, subtotal: existing.subtotal + d.subtotal })

        const katExisting = kategoriMap.get(kategori) || { qty: 0, omzet: 0 }
        kategoriMap.set(kategori, { qty: katExisting.qty + d.qty, omzet: katExisting.omzet + d.subtotal })
    })

    const totalOmzet = penjualan?.total_omzet || 0

    return {
        totalTransactions: penjualan?.total_transaksi || 0,
        totalOmzet,
        totalModal,
        totalLaba: totalOmzet - totalModal,
        itemsSold: Array.from(itemsMap.entries()).map(([nama_barang, data]) => ({ nama_barang, ...data })),
        byKategori: Array.from(kategoriMap.entries()).map(([kategori, data]) => ({ kategori, ...data })),
        endingStock: barang?.map(b => ({ nama_barang: b.nama_barang, kategori: b.kategori, stok: b.stok })) || [],
    }
}

export async function getWeeklyReport(startDate: string, endDate: string): Promise<ReportSummary> {
    const supabase = await createClient()

    const { data: penjualan } = await supabase
        .from('penjualan')
        .select('total_transaksi, total_omzet')
        .gte('tanggal', startDate)
        .lte('tanggal', endDate)

    const totalTransactions = penjualan?.reduce((sum, p) => sum + p.total_transaksi, 0) || 0
    const totalOmzet = penjualan?.reduce((sum, p) => sum + p.total_omzet, 0) || 0

    const { data: details } = await supabase
        .from('detail_penjualan')
        .select(`qty, subtotal, harga_modal, barang:barang_id(nama_barang, kategori)`)
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59`)

    const { data: barang } = await supabase
        .from('barang')
        .select('nama_barang, kategori, stok')
        .eq('status', 'aktif')
        .order('nama_barang')

    let totalModal = 0
    const itemsMap = new Map<string, { kategori: string; qty: number; subtotal: number }>()
    const kategoriMap = new Map<string, { qty: number; omzet: number }>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?.forEach((d: any) => {
        const nama = d.barang?.nama_barang || 'Unknown'
        const kategori = d.barang?.kategori || 'snack'
        totalModal += d.harga_modal || 0

        const existing = itemsMap.get(nama) || { kategori, qty: 0, subtotal: 0 }
        itemsMap.set(nama, { kategori, qty: existing.qty + d.qty, subtotal: existing.subtotal + d.subtotal })

        const katExisting = kategoriMap.get(kategori) || { qty: 0, omzet: 0 }
        kategoriMap.set(kategori, { qty: katExisting.qty + d.qty, omzet: katExisting.omzet + d.subtotal })
    })

    return {
        totalTransactions,
        totalOmzet,
        totalModal,
        totalLaba: totalOmzet - totalModal,
        itemsSold: Array.from(itemsMap.entries()).map(([nama_barang, data]) => ({ nama_barang, ...data })),
        byKategori: Array.from(kategoriMap.entries()).map(([kategori, data]) => ({ kategori, ...data })),
        endingStock: barang?.map(b => ({ nama_barang: b.nama_barang, kategori: b.kategori, stok: b.stok })) || [],
    }
}

export async function getMonthlyReport(year: number, month: number): Promise<ReportSummary> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`
    return getWeeklyReport(startDate, endDate)
}

export async function getSalesTrend(days: number = 7): Promise<{ date: string; omzet: number }[]> {
    const supabase = await createClient()
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days + 1)

    const startStr = startDate.toISOString().split('T')[0]
    const endStr = endDate.toISOString().split('T')[0]

    const { data: penjualan } = await supabase
        .from('penjualan')
        .select('tanggal, total_omzet')
        .gte('tanggal', startStr)
        .lte('tanggal', endStr)
        .order('tanggal')

    // Fill missing days with 0
    const result = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const record = penjualan?.find(p => p.tanggal === dateStr)
        result.push({
            date: dateStr,
            omzet: record?.total_omzet || 0
        })
    }

    return result
    return result
}

export async function getTopCategories(startDate: string, endDate: string): Promise<{ name: string; value: number }[]> {
    const supabase = await createClient()

    const { data: details } = await supabase
        .from('detail_penjualan')
        .select(`subtotal, barang:barang_id(kategori)`)
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59`)

    const categoryMap = new Map<string, number>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?.forEach((d: any) => {
        const category = d.barang?.kategori || 'lainnya'
        const current = categoryMap.get(category) || 0
        categoryMap.set(category, current + d.subtotal)
    })

    const result = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Top 5

    return result
}

export async function getLowStockItems(limit: number = 5): Promise<{ nama_barang: string; stok: number }[]> {
    const supabase = await createClient()

    const { data } = await supabase
        .from('barang')
        .select('nama_barang, stok')
        .lt('stok', 5) // Alert threshold
        .order('stok', { ascending: true })
        .limit(limit)

    return data || []
}
