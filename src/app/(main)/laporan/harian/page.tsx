import { requireAuth } from '@/lib/auth'
import { getDailyReport } from '@/lib/reports'
import { ReportTable } from '../report-table'
import Link from 'next/link'

export default async function LaporanHarianPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>
}) {
    await requireAuth()
    const params = await searchParams
    const today = new Date().toISOString().split('T')[0]
    const date = params.date || today

    const data = await getDailyReport(date)

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Laporan Harian</h1>
                <Link href="/laporan" className="text-blue-600 hover:underline">← Kembali</Link>
            </div>

            <form className="mb-6 flex gap-4 items-end">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
                    <input type="date" name="date" defaultValue={date} max={today} className="p-2 border rounded" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Lihat</button>
            </form>

            <p className="text-gray-600 mb-4">Tanggal: {date}</p>
            <ReportTable data={data} period="harian" />
        </div>
    )
}
