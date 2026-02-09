'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createBarang, updateBarang } from './actions'
import { Barang, KategoriRow, SATUAN_OPTIONS } from '@/types'
import { addKategori } from '../kategori/actions'

export function BarangForm({ barang, categories }: { barang?: Barang, categories: KategoriRow[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Inline Category Creation State
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [categoryList, setCategoryList] = useState(categories)
    const [selectedCategory, setSelectedCategory] = useState(barang?.kategori || (categories[0]?.nama || ''))

    async function handleAddCategory() {
        if (!newCategoryName.trim()) return

        setLoading(true)
        try {
            await addKategori(newCategoryName.trim().toLowerCase())
            // Optimistically update list or re-fetch? 
            // Since addKategori revalidates path, we might need to refresh router but for instant UI feedback:
            const newCat = { id: 'temp-' + Date.now(), nama: newCategoryName.trim().toLowerCase(), created_at: new Date().toISOString() }
            setCategoryList(prev => [...prev, newCat].sort((a, b) => a.nama.localeCompare(b.nama)))
            setSelectedCategory(newCat.nama)
            setIsAddingCategory(false)
            setNewCategoryName('')
        } catch (e) {
            setError('Gagal menambah kategori: ' + (e as Error).message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError('')

        // Ensure the selected category is used in formData if we are in adding mode or just to be safe
        // (The select/input might handle it but let's be explicit)
        // Actually, if we use controlled input for select, we need to make sure formData picks it up.
        // It does pick up 'name="kategori"' from the DOM element.

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
                <div className="relative">
                    <label className="block text-gray-700 mb-2 flex justify-between items-center">
                        Kategori
                        {!isAddingCategory && (
                            <button
                                type="button"
                                onClick={() => setIsAddingCategory(true)}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                            >
                                + Baru
                            </button>
                        )}
                    </label>

                    {isAddingCategory ? (
                        <div className="flex gap-2">
                            <input
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder="Nama kategori..."
                                className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white text-sm"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                disabled={!newCategoryName.trim() || loading}
                                className="bg-green-600 text-white px-3 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                ✓
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddingCategory(false)}
                                className="bg-gray-300 text-gray-700 px-3 rounded hover:bg-gray-400"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <select
                            name="kategori"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white"
                        >
                            {categoryList.map(opt => (
                                <option key={opt.id} value={opt.nama}>{opt.nama}</option>
                            ))}
                        </select>
                    )}
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
