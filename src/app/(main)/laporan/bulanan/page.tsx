import { requireRole } from '@/lib/auth'
import { getMonthlyReport } from '@/lib/reports'
import { ReportTable } from '../report-table'
import Link from 'next/link'

export default async function LaporanBulananPage({
    searchParams,
}: {
    searchParams: Promise<{ year?: string; month?: string }>
}) {
    await requireRole(['foundation_admin'])
    const params = await searchParams
    const now = new Date()
    const year = params.year ? parseInt(params.year) : now.getFullYear()
    const month = params.month ? parseInt(params.month) : now.getMonth() + 1
    const data = await getMonthlyReport(year, month)

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Laporan Bulanan</h1>
                <Link href="/laporan" className="text-blue-600 hover:underline">← Kembali</Link>
            </div>

            <form className="mb-6 flex gap-4 items-end">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Bulan</label>
                    <select name="month" defaultValue={month} className="p-2 border rounded">
                        {months.map((m, i) => (<option key={i} value={i + 1}>{m}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Tahun</label>
                    <input type="number" name="year" defaultValue={year} min="2020" max="2030" className="p-2 border rounded w-24" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Lihat</button>
            </form>

            <p className="text-gray-600 mb-4">Periode: {months[month - 1]} {year}</p>
            <ReportTable data={data} period="bulanan" />
        </div>
    )
}
