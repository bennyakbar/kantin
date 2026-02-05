'use client'

import { useState } from 'react'
import { tambahStok } from './actions'
import { Barang } from '@/types'

export function RestokForm({ barangList }: { barangList: Barang[] }) {
    const [barangId, setBarangId] = useState('')
    const [qty, setQty] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    const filtered = barangList.filter(b =>
        b.nama_barang.toLowerCase().includes(search.toLowerCase())
    )

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!barangId || qty <= 0) return

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await tambahStok(barangId, qty)
            const barang = barangList.find(b => b.id === barangId)
            setSuccess(`Berhasil menambah ${qty} stok untuk ${barang?.nama_barang}`)
            setQty(1)
            setBarangId('')
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const selectedBarang = barangList.find(b => b.id === barangId)

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cari Barang</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ketik nama barang..."
                    className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Pilih Barang</label>
                <select
                    value={barangId}
                    onChange={(e) => setBarangId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white"
                    required
                >
                    <option value="">-- Pilih Barang --</option>
                    {filtered.map((barang) => (
                        <option key={barang.id} value={barang.id}>
                            {barang.nama_barang} (Stok: {barang.stok} {barang.satuan})
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Jumlah Tambah Stok</label>
                <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                    className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white"
                    required
                />
            </div>

            {selectedBarang && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-gray-600 text-sm">Stok saat ini: <b>{selectedBarang.stok}</b></p>
                    <p className="text-gray-600 text-sm">Stok setelah: <b className="text-green-600">{selectedBarang.stok + qty}</b></p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !barangId}
                style={{ backgroundColor: '#007235' }}
                className="w-full text-white p-3 rounded hover:opacity-80 disabled:opacity-50 transition font-semibold"
            >
                {loading ? 'Menyimpan...' : 'Tambah Stok'}
            </button>
        </form>
    )
}
