'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createBarang, updateBarang } from './actions'
import { Barang, KategoriRow, SATUAN_OPTIONS } from '@/types'

export function BarangForm({ barang, categories }: { barang?: Barang, categories: KategoriRow[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError('')
        try {
            if (barang) { await updateBarang(barang.id, formData) }
            else { await createBarang(formData) }
            router.push('/barang')
        } catch (e) {
            setError((e as Error).message)
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Barang</label>
                <input name="nama_barang" defaultValue={barang?.nama_barang} required maxLength={100} className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-2">Kategori</label>
                    <select name="kategori" defaultValue={barang?.kategori || (categories[0]?.nama || '')} className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white">
                        {categories.map(opt => (
                            <option key={opt.id} value={opt.nama}>{opt.nama}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Satuan</label>
                    <select name="satuan" defaultValue={barang?.satuan || 'pcs'} className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white">
                        {SATUAN_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-2">Harga Modal (Rp)</label>
                    <input name="harga_modal" type="number" min="0" defaultValue={barang?.harga_modal || 0} required className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white" />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Harga Jual (Rp)</label>
                    <input name="harga_jual" type="number" min="0" defaultValue={barang?.harga_jual} required className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white" />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Stok</label>
                <input name="stok" type="number" min="0" defaultValue={barang?.stok ?? 0} required className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white" />
            </div>

            <div className="flex gap-4">
                <button type="submit" disabled={loading} style={{ backgroundColor: '#353535' }} className="text-white px-6 py-2 rounded hover:opacity-80 disabled:opacity-50 transition">{loading ? 'Menyimpan...' : barang ? 'Update' : 'Simpan'}</button>
                <button type="button" onClick={() => router.back()} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Batal</button>
            </div>
        </form>
    )
}
