'use client'

import { useState } from 'react'
import { processTransaction } from './actions'
import { Barang } from '@/types'
import { Receipt, ReceiptItem } from '@/components/penjualan/Receipt'

export function SalesForm({ barangList, isClosed }: { barangList: Barang[]; isClosed: boolean }) {
    const [barangId, setBarangId] = useState('')
    const [qty, setQty] = useState(1)
    const [cart, setCart] = useState<{ id: string; barang: Barang; qty: number }[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [lastTransaction, setLastTransaction] = useState<{ items: ReceiptItem[]; total: number; date: string } | null>(null)

    function addToCart(e: React.FormEvent) {
        e.preventDefault()
        if (!barangId) return

        const barang = barangList.find(b => b.id === barangId)
        if (!barang) return

        // Check stock including cart
        const inCart = cart.find(c => c.id === barangId)?.qty || 0
        if (barang.stok < (qty + inCart)) {
            setError(`Stok tidak cukup (Sisa: ${barang.stok}, Di Keranjang: ${inCart})`)
            return
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === barangId)
            if (existing) {
                return prev.map(item => item.id === barangId ? { ...item, qty: item.qty + qty } : item)
            }
            return [...prev, { id: barangId, barang, qty }]
        })

        setQty(1)
        setBarangId('')
        setError('')
    }

    function removeFromCart(id: string) {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    async function handleCheckout() {
        if (cart.length === 0) return
        setLoading(true)
        setError('')

        try {
            await processTransaction(cart.map(c => ({ barangId: c.id, qty: c.qty })))

            // Prepare Receipt Data
            const receiptItems = cart.map(c => ({
                nama: c.barang.nama_barang,
                qty: c.qty,
                harga: c.barang.harga_jual,
                subtotal: c.barang.harga_jual * c.qty
            }))
            const total = receiptItems.reduce((sum, item) => sum + item.subtotal, 0)

            setLastTransaction({
                items: receiptItems,
                total,
                date: new Date().toLocaleString('id-ID')
            })

            // Reset
            setCart([])
            setSuccess('Transaksi berhasil!')
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setLoading(false)
        }
    }

    function handlePrint() {
        window.print()
    }

    if (isClosed) {
        return <div className="bg-yellow-100 text-yellow-700 p-4 rounded">Penjualan hari ini sudah ditutup</div>
    }

    const cartTotal = cart.reduce((sum, item) => sum + (item.barang.harga_jual * item.qty), 0)
    const selectedBarang = barangList.find(b => b.id === barangId)

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
            {/* Input Section */}
            <form onSubmit={addToCart} className="space-y-4 no-print">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded flex justify-between items-center">
                    <span>{success}</span>
                    <button type="button" onClick={() => setSuccess('')} className="text-sm underline">Tutup</button>
                </div>}

                <div>
                    <label className="block text-gray-700 mb-2">Pilih Barang</label>
                    <select
                        value={barangId}
                        onChange={(e) => setBarangId(e.target.value)}
                        className="w-full p-3 border rounded"
                    >
                        <option value="">-- Pilih Barang --</option>
                        {barangList.map((b) => (
                            <option key={b.id} value={b.id} disabled={b.stok === 0}>
                                {b.nama_barang} - Rp {b.harga_jual.toLocaleString()} (Sisa: {b.stok})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Jumlah</label>
                        <input
                            type="number"
                            min="1"
                            max={selectedBarang?.stok || 999}
                            value={qty}
                            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                            className="w-full p-3 border rounded"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={!barangId}
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            + Tambah
                        </button>
                    </div>
                </div>
            </form>

            {/* Cart Section */}
            <div className="no-print">
                <h3 className="font-bold border-b pb-2 mb-2">Keranjang Belanja</h3>
                {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm">Keranjang kosong</p>
                ) : (
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <div>
                                    <p className="font-medium">{item.barang.nama_barang}</p>
                                    <p className="text-xs text-gray-500">{item.qty} x Rp {item.barang.harga_jual.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold">Rp {(item.barang.harga_jual * item.qty).toLocaleString()}</span>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">✕</button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 border-t mt-4">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-xl font-bold text-blue-700">Rp {cartTotal.toLocaleString('id-ID')}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Memproses...' : 'Bayar & Simpan'}
                        </button>
                    </div>
                )}
            </div>

            {/* Receipt Print Section - Visible only in Print or when transaction just finished */}
            {lastTransaction && (
                <div className="mt-6 border-t pt-4 no-print">
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded">
                        <div>
                            <p className="font-bold text-green-700">Transaksi Terakhir Berhasil</p>
                            <p className="text-sm">Total: Rp {lastTransaction.total.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-black"
                        >
                            🖨️ Cetak Struk
                        </button>
                    </div>
                </div>
            )}

            {/* The Actual Receipt Component (Hidden on Screen, Visible on Print) */}
            <div className="hidden print:block fixed top-0 left-0 bg-white w-full h-full p-0 m-0 z-50">
                {lastTransaction && (
                    <div className="w-[58mm] mx-auto">
                        <Receipt
                            items={lastTransaction.items}
                            total={lastTransaction.total}
                            date={lastTransaction.date}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
