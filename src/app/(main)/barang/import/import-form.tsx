'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { importBarang } from './actions'
import Papa from 'papaparse'

export function ImportForm() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setError('')
        setSuccess('')

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setPreview(results.data.slice(0, 5))
            },
            error: () => {
                setError('Gagal membaca file CSV')
            }
        })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!file) return

        setLoading(true)
        setError('')

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const data = results.data as any[]
                    if (data.length === 0) {
                        setError('File kosong atau format tidak valid')
                        setLoading(false)
                        return
                    }

                    const result = await importBarang(data)
                    setSuccess(`Berhasil import ${result.count} barang!`)
                    setTimeout(() => router.push('/barang'), 2000)
                } catch (e) {
                    setError((e as Error).message)
                } finally {
                    setLoading(false)
                }
            },
            error: () => {
                setError('Gagal membaca file')
                setLoading(false)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 border border-green-300">{success}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Pilih File CSV</label>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="w-full p-3 border-2 border-gray-300 rounded bg-white"
                    required
                />
            </div>

            {preview.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Preview (5 baris pertama):</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border">
                            <thead>
                                <tr className="bg-gray-100">
                                    {Object.keys(preview[0]).map((key) => (
                                        <th key={key} className="px-2 py-1 border text-left">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.map((row, i) => (
                                    <tr key={i}>
                                        {Object.values(row).map((val, j) => (
                                            <td key={j} className="px-2 py-1 border">{String(val)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Total: {file ? 'memproses...' : '0'} baris
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !file}
                style={{ backgroundColor: '#007235' }}
                className="w-full text-white p-3 rounded hover:opacity-80 disabled:opacity-50 transition font-semibold"
            >
                {loading ? 'Mengimport...' : 'Import Data'}
            </button>
        </form>
    )
}
