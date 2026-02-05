-- Migration: Add kategori, satuan, harga_modal to barang

ALTER TABLE public.barang 
ADD COLUMN IF NOT EXISTS kategori text NOT NULL DEFAULT 'snack' CHECK (kategori IN ('makanan', 'minuman', 'snack')),
ADD COLUMN IF NOT EXISTS satuan text NOT NULL DEFAULT 'pcs' CHECK (satuan IN ('pcs', 'bungkus', 'botol', 'porsi', 'cup', 'kotak')),
ADD COLUMN IF NOT EXISTS harga_modal integer NOT NULL DEFAULT 0 CHECK (harga_modal >= 0);

-- Add harga_modal to detail_penjualan for profit tracking
ALTER TABLE public.detail_penjualan
ADD COLUMN IF NOT EXISTS harga_modal integer NOT NULL DEFAULT 0;
