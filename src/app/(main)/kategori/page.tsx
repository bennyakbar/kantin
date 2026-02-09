import { requireRole } from '@/lib/auth'
import { getKategori } from './actions'
import { KategoriList } from './kategori-list'

export default async function KategoriPage() {
    await requireRole(['foundation_admin'])
    const categories = await getKategori()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manajemen Kategori</h1>
            <div className="max-w-2xl">
                <p className="text-gray-600 mb-6">
                    Kelola daftar kategori barang. Kategori yang sedang digunakan oleh barang tidak dapat dihapus.
                </p>
                <KategoriList categories={categories} />
            </div>
        </div>
    )
}
