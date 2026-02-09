import { requireAuth, isKeeper, isAdmin } from '@/lib/auth'
import Link from 'next/link'

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await requireAuth()
    const keeper = isKeeper(user.role)
    const admin = isAdmin(user.role)

    return (
        <div className="min-h-screen bg-white">
            {/* Header with green gradient */}
            <nav style={{ background: 'linear-gradient(to right, #007235, #0a4a2a)' }} className="shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/dashboard" className="font-bold text-xl text-white">
                            🏪 MTW Nurul Falah
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-white/90 hidden sm:inline">{user.nama}</span>
                            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                                {keeper ? 'Penjaga' : 'Yayasan'}
                            </span>
                            <form action="/api/auth/logout" method="POST">
                                <button className="text-white hover:text-red-200 font-medium">Logout</button>
                            </form>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="pb-3 flex gap-2 overflow-x-auto">
                        <Link href="/dashboard" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                            📊 Dashboard
                        </Link>
                        {keeper && (
                            <>
                                <Link href="/penjualan" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                                    🛒 Penjualan
                                </Link>
                                <Link href="/barang" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                                    📦 Barang
                                </Link>
                                <Link href="/stok" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                                    ➕ Restok
                                </Link>
                                <Link href="/pengeluaran" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                                    💸 Pengeluaran
                                </Link>
                            </>
                        )}
                        <Link href="/riwayat" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                            📝 Riwayat
                        </Link>
                        <Link href="/laporan" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                            📈 Laporan
                        </Link>
                        <Link href="/inventory" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                            📋 Inventory
                        </Link>
                        {admin && (
                            <Link href="/kategori" style={{ backgroundColor: '#353535' }} className="text-sm px-4 py-2 hover:opacity-80 text-white rounded-lg whitespace-nowrap font-medium transition">
                                🏷️ Kategori
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
        </div>
    )
}
