import { requireRole } from '@/lib/auth'
import { ImportForm } from './import-form'
import Link from 'next/link'

export default async function ImportBarangPage() {
    await requireRole(['canteen_keeper'])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Import Barang</h1>
                <Link href="/barang" style={{ backgroundColor: '#353535' }} className="text-white px-4 py-2 rounded hover:opacity-80 transition">
                    ← Kembali
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Upload File CSV</h2>
                    <ImportForm />
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Template & Panduan</h2>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <p className="mb-4">Download template CSV berikut, isi data, lalu upload:</p>

                        <a
                            href="/template_barang.csv"
                            download
                            style={{ backgroundColor: '#007235' }}
                            className="inline-block text-white px-4 py-2 rounded hover:opacity-80 transition mb-6"
                        >
                            📥 Download Template CSV
                        </a>

                        <h3 className="font-semibold mb-2">Format Header:</h3>
                        <div className="bg-gray-100 p-3 rounded text-sm font-mono mb-4 overflow-x-auto">
                            nama_barang,kategori,satuan,harga_modal,harga_jual,stok
                        </div>

                        <h3 className="font-semibold mb-2">Nilai yang Valid:</h3>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">kategori</td>
                                    <td className="py-2">makanan, minuman, snack</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">satuan</td>
                                    <td className="py-2">pcs, bungkus, botol, porsi, cup, kotak</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">harga_modal</td>
                                    <td className="py-2">Angka (tanpa Rp atau titik)</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">harga_jual</td>
                                    <td className="py-2">Angka (tanpa Rp atau titik)</td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-semibold">stok</td>
                                    <td className="py-2">Angka</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
