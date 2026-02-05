'use client'

import React from 'react'

export interface ReceiptItem {
    nama: string
    qty: number
    harga: number
    subtotal: number
}

export const Receipt = React.forwardRef<HTMLDivElement, { items: ReceiptItem[], total: number; date: string }>(
    ({ items, total, date }, ref) => {
        return (
            <div ref={ref} className="p-2 font-mono text-sm max-w-[300px] bg-white text-black">
                <div className="text-center mb-4 border-b border-black pb-2">
                    <h1 className="font-bold text-lg">KANTIN MADRASAH</h1>
                    <p className="text-xs">MTW Nurul Falah</p>
                    <p className="text-xs">{date}</p>
                </div>

                <div className="mb-4 border-b border-black pb-2 border-dashed">
                    {items.map((item, i) => (
                        <div key={i} className="mb-1">
                            <div className="flex justify-between font-bold">
                                <span>{item.nama}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>{item.qty} x {item.harga.toLocaleString('id-ID')}</span>
                                <span>{item.subtotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between font-bold text-lg border-b border-black pb-2 mb-4">
                    <span>TOTAL</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>

                <div className="text-center text-xs">
                    <p>Terima Kasih</p>
                    <p>Barang yang dibeli tidak dapat ditukar/dikembalikan</p>
                </div>
            </div>
        )
    }
)

Receipt.displayName = 'Receipt'
