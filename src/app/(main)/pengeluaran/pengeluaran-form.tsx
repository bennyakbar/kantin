'use client'

import { useState } from 'react'
import { addPengeluaran } from '../stok/actions'

const KATEGORI_PENGELUARAN = [
    { value: 'pembelian_stok', label: 'Pembelian Stok' },
    { value: 'operasional', label: 'Operasional' },
    { value: 'lainnya', label: 'Lainnya' },
]

export function PengeluaranForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await addPengeluaran(formData)
            setSuccess('Pengeluaran berhasil dicatat')
            // Reset form
            const form = document.getElementById('pengeluaran-form') as HTMLFormElement
            form?.reset()
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form id="pengeluaran-form" action={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kategori</label>
                <select
                    name="kategori"
                    className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white"
                    required
                >
                    {KATEGORI_PENGELUARAN.map(k => (
                        <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Keterangan</label>
                <input
                    name="keterangan"
                    type="text"
                    placeholder="Contoh: Beli snack dari supplier"
                    className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Jumlah (Rp)</label>
                <input
                    name="jumlah"
                    type="number"
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded text-gray-900 bg-white"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700 disabled:opacity-50"
            >
                {loading ? 'Menyimpan...' : 'Catat Pengeluaran'}
            </button>
        </form>
    )
}
