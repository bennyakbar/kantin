import { requireRole } from '@/lib/auth'
import { BarangForm } from '../barang-form'
import { getKategori } from '../../kategori/actions'

export default async function TambahBarangPage() {
    await requireRole(['canteen_keeper'])
    const categories = await getKategori()
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tambah Barang</h1>
            <BarangForm categories={categories} />
        </div>
    )
}
