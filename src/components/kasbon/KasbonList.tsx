'use client'

import { useState } from 'react'
import { addKasbon, markLunas } from '@/lib/kasbon'
import { useRouter } from 'next/navigation'

export function KasbonList({ initialData }: { initialData: any[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [nominal, setNominal] = useState('')
    const [desc, setDesc] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            await addKasbon(name, parseInt(nominal), desc)
            setName('')
            setNominal('')
            setDesc('')
            router.refresh()
        } catch (error) {
            alert('Gagal menambah kasbon')
        } finally {
            setLoading(false)
        }
    }

    async function handleLunas(id: string, nama: string) {
        if (!confirm(`Tandai lunas kasbon atas nama ${nama}?`)) return
        setLoading(true)
        try {
            await markLunas(id)
            router.refresh()
        } catch (error) {
            alert('Gagal update status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow h-fit">
                <h2 className="text-xl font-bold mb-4">Catat Kasbon Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Peminjam</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Contoh: Pak Budi"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nominal (Rp)</label>
                        <input
                            required
                            type="number"
                            value={nominal}
                            onChange={(e) => setNominal(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Keterangan (Opsional)</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows={3}
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Kasbon'}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Daftar Belum Lunas</h2>
                {initialData.length === 0 && <p className="text-gray-500">Tidak ada data kasbon aktif.</p>}

                {initialData.map((k) => (
                    <div key={k.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{k.nama_peminjam}</h3>
                            <p className="text-red-600 font-bold">Rp {k.nominal.toLocaleString('id-ID')}</p>
                            {k.keterangan && <p className="text-sm text-gray-500">{k.keterangan}</p>}
                            <p className="text-xs text-gray-400 mt-1">{new Date(k.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                        <button
                            onClick={() => handleLunas(k.id, k.nama_peminjam)}
                            disabled={loading}
                            className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 text-sm font-semibold"
                        >
                            Bayar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
