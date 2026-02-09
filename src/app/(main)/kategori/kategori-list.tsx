'use client'

import { useState } from 'react'
import { KategoriRow } from '@/types'
import { addKategori, deleteKategori } from './actions'

export function KategoriList({ categories }: { categories: KategoriRow[] }) {
    const [newCategory, setNewCategory] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        if (!newCategory.trim()) return

        setLoading(true)
        setError('')
        try {
            await addKategori(newCategory.trim().toLowerCase())
            setNewCategory('')
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Hapus kategori ini?')) return
        try {
            await deleteKategori(id)
        } catch (e) {
            alert('Gagal menghapus: ' + (e as Error).message)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                <input
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Nama kategori baru..."
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !newCategory.trim()}
                    style={{ backgroundColor: '#353535' }}
                    className="text-white px-4 py-2 rounded hover:opacity-80 disabled:opacity-50 transition"
                >
                    {loading ? '...' : 'Tambah'}
                </button>
            </form>

            <div className="overflow-hidden border rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Nama Kategori</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td className="px-4 py-3 capitalize">{c.nama}</td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-4 py-8 text-center text-gray-500">Belum ada kategori</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
