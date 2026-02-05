-- Sample Data: Barang Kantin
-- Jalankan di Supabase SQL Editor setelah migration

-- MAKANAN
INSERT INTO public.barang (nama_barang, kategori, satuan, harga_modal, harga_jual, stok, status) VALUES
('Nasi Goreng', 'makanan', 'porsi', 8000, 12000, 50, 'aktif'),
('Mie Goreng', 'makanan', 'porsi', 7000, 10000, 50, 'aktif'),
('Bakso', 'makanan', 'porsi', 6000, 10000, 30, 'aktif'),
('Soto Ayam', 'makanan', 'porsi', 7000, 12000, 30, 'aktif'),
('Nasi Uduk', 'makanan', 'porsi', 5000, 8000, 40, 'aktif'),
('Bubur Ayam', 'makanan', 'porsi', 5000, 8000, 25, 'aktif');

-- MINUMAN
INSERT INTO public.barang (nama_barang, kategori, satuan, harga_modal, harga_jual, stok, status) VALUES
('Es Teh Manis', 'minuman', 'cup', 1500, 3000, 100, 'aktif'),
('Es Jeruk', 'minuman', 'cup', 2000, 4000, 80, 'aktif'),
('Jus Alpukat', 'minuman', 'cup', 4000, 8000, 30, 'aktif'),
('Jus Mangga', 'minuman', 'cup', 3500, 7000, 30, 'aktif'),
('Air Mineral', 'minuman', 'botol', 2000, 3000, 100, 'aktif'),
('Susu Kotak', 'minuman', 'kotak', 3000, 5000, 50, 'aktif'),
('Teh Kotak', 'minuman', 'kotak', 2500, 4000, 50, 'aktif');

-- SNACK
INSERT INTO public.barang (nama_barang, kategori, satuan, harga_modal, harga_jual, stok, status) VALUES
('Keripik Singkong', 'snack', 'bungkus', 2000, 3500, 60, 'aktif'),
('Keripik Kentang', 'snack', 'bungkus', 3000, 5000, 50, 'aktif'),
('Biskuit', 'snack', 'bungkus', 2500, 4000, 60, 'aktif'),
('Wafer', 'snack', 'bungkus', 2000, 3500, 70, 'aktif'),
('Coklat Batang', 'snack', 'pcs', 3000, 5000, 40, 'aktif'),
('Roti Sandwich', 'snack', 'pcs', 4000, 7000, 30, 'aktif'),
('Donat', 'snack', 'pcs', 2500, 5000, 40, 'aktif'),
('Pisang Goreng', 'snack', 'pcs', 1500, 3000, 50, 'aktif'),
('Martabak Mini', 'snack', 'pcs', 3000, 6000, 30, 'aktif');

-- Verifikasi Data
-- SELECT kategori, COUNT(*) as jumlah, SUM(stok) as total_stok FROM public.barang GROUP BY kategori;
