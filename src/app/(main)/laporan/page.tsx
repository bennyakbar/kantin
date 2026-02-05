import { requireAuth, isAdmin } from '@/lib/auth'
import Link from 'next/link'

export default async function LaporanPage() {
    const user = await requireAuth()
    const admin = isAdmin(user.role)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Laporan</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/laporan/harian"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md"
                >
                    <h2 className="text-lg font-semibold">Laporan Harian</h2>
                    <p className="text-gray-600 text-sm">Lihat penjualan hari ini</p>
                </Link>

                {admin && (
                    <>
                        <Link
                            href="/laporan/mingguan"
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md"
                        >
                            <h2 className="text-lg font-semibold">Laporan Mingguan</h2>
                            <p className="text-gray-600 text-sm">Ringkasan 7 hari terakhir</p>
                        </Link>

                        <Link
                            href="/laporan/bulanan"
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md"
                        >
                            <h2 className="text-lg font-semibold">Laporan Bulanan</h2>
                            <p className="text-gray-600 text-sm">Ringkasan 30 hari terakhir</p>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}
