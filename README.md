# MTW Nurul Falah - Sistem Kantin

Aplikasi manajemen kantin untuk MTW Nurul Falah. Dibangun dengan Next.js dan Supabase.

## 🌐 Live Demo

**URL:** https://mtwnurulfalah.netlify.app

## ✨ Fitur

### Penjualan
- 🛒 Input penjualan harian
- 📝 Riwayat transaksi dengan filter tanggal
- 🔒 Fitur "Tutup Hari" untuk mengunci transaksi

### Manajemen Barang
- 📦 CRUD master barang
- 📥 Import batch via CSV
- 🏷️ Kategori: Makanan, Minuman, Snack
- 📏 Satuan: Pcs, Bungkus, Botol, Porsi, Cup, Kotak

### Stok & Inventory
- ➕ Restok cepat dengan search
- 📋 Overview inventory lengkap
- ⚠️ Peringatan stok rendah
- 💰 Nilai stok (modal & jual)

### Keuangan
- 💸 Pencatatan pengeluaran
- 📈 Laporan harian, mingguan, bulanan
- 💵 Kalkulasi omzet, modal, dan laba
- 🖨️ Print / Export PDF

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Hosting:** Netlify

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. Clone repository
```bash
git clone https://github.com/bennyakbar/kantin.git
cd kantin
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run development server
```bash
npm run dev
```

5. Open http://localhost:3000

### Database Setup

Jalankan SQL migrations di Supabase SQL Editor:
1. `supabase/schema.sql` - Tabel utama
2. `supabase/migration_001.sql` - Tambah kolom kategori, satuan, harga_modal
3. `supabase/migration_002.sql` - Tabel pengeluaran
4. `supabase/sample_data.sql` - Data sample (opsional)
5. `supabase/migration_kasbon.sql` - Table kasbon

## 👥 User Roles

| Role | Akses |
|------|-------|
| Penjaga Kantin | Penjualan, Barang, Stok, Pengeluaran, Riwayat, Laporan, Inventory |
| Yayasan | Dashboard, Riwayat, Laporan, Inventory |

## 📱 Screenshots

- Dashboard dengan ringkasan penjualan
- Form penjualan dengan search barang
- Laporan dengan breakdown per kategori
- Print-friendly report layout

## 📝 License

MIT License

## 🤝 Contributing

Pull requests are welcome.

---

Developed for MTW Nurul Falah
