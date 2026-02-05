import { requireRole } from '@/lib/auth'
import { getWeeklyReport } from '@/lib/reports'
import { ReportTable } from '../report-table'
import Link from 'next/link'

function getWeekRange(date: Date) {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(date.setDate(diff))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    return { start: monday.toISOString().split('T')[0], end: sunday.toISOString().split('T')[0] }
}

export default async function LaporanMingguanPage({
    searchParams,
}: {
    searchParams: Promise<{ start?: string; end?: string }>
}) {
    await requireRole(['foundation_admin'])
    const params = await searchParams
    const defaultRange = getWeekRange(new Date())
    const start = params.start || defaultRange.start
    const end = params.end || defaultRange.end
    const data = await getWeeklyReport(start, end)

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Laporan Mingguan</h1>
                <Link href="/laporan" className="text-blue-600 hover:underline">← Kembali</Link>
            </div>

            <form className="mb-6 flex gap-4 items-end">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Dari</label>
                    <input type="date" name="start" defaultValue={start} className="p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Sampai</label>
                    <input type="date" name="end" defaultValue={end} className="p-2 border rounded" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Lihat</button>
            </form>

            <p className="text-gray-600 mb-4">Periode: {start} s/d {end}</p>
            <ReportTable data={data} period="mingguan" />
        </div>
    )
}
