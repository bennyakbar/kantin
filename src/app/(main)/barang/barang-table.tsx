'use client'

import { Barang, KATEGORI_OPTIONS } from '@/types'
import { toggleBarangStatus } from './actions'
import Link from 'next/link'
import { useState } from 'react'

export function BarangTable({ barangList }: { barangList: Barang[] }) {
    const [filter, setFilter] = useState('')

    const filtered = filter
        ? barangList.filter(b => b.kategori === filter)
        : barangList

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <button onClick={() => setFilter('')} style={!filter ? { backgroundColor: '#353535' } : {}} className={`px-3 py-1 rounded transition ${!filter ? 'text-white' : 'bg-gray-200 text-gray-700'}`}>Semua</button>
                {KATEGORI_OPTIONS.map(k => (
                    <button key={k.value} onClick={() => setFilter(k.value)} style={filter === k.value ? { backgroundColor: '#353535' } : {}} className={`px-3 py-1 rounded transition ${filter === k.value ? 'text-white' : 'bg-gray-200 text-gray-700'}`}>{k.label}</button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Nama Barang</th>
                            <th className="px-4 py-3 text-center">Kategori</th>
                            <th className="px-4 py-3 text-center">Satuan</th>
                            <th className="px-4 py-3 text-right">Modal</th>
                            <th className="px-4 py-3 text-right">Jual</th>
                            <th className="px-4 py-3 text-right">Stok</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((barang) => (
                            <tr key={barang.id} className="border-t">
                                <td className="px-4 py-3">{barang.nama_barang}</td>
                                <td className="px-4 py-3 text-center capitalize">{barang.kategori}</td>
                                <td className="px-4 py-3 text-center capitalize">{barang.satuan}</td>
                                <td className="px-4 py-3 text-right">Rp {barang.harga_modal?.toLocaleString('id-ID') || 0}</td>
                                <td className="px-4 py-3 text-right">Rp {barang.harga_jual.toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3 text-right">{barang.stok}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded text-sm ${barang.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{barang.status}</span>
                                </td>
                                <td className="px-4 py-3 text-center space-x-2">
                                    <Link href={`/barang/${barang.id}`} style={{ backgroundColor: '#353535' }} className="text-white px-3 py-1 rounded text-sm hover:opacity-80 transition">Edit</Link>
                                    <button onClick={() => toggleBarangStatus(barang.id, barang.status)} className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:opacity-80 transition">{barang.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (<tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Belum ada barang</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
