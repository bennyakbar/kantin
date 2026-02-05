# ERD — Aplikasi Kantin Sekolah

Dokumen ini berisi **ERD konseptual + diagram visual** serta **alur aplikasi (app flow)** untuk Aplikasi Kantin SD / SD Islam.

---

## 🧩 ENTITY RELATIONSHIP DIAGRAM (ERD)

### 👤 Entity: User
- id
- nama
- role (penjaga / yayasan)
- credential

### 📦 Entity: Barang
- id
- nama_barang
- harga_jual
- stok
- status (aktif / nonaktif)

### 🧾 Entity: Penjualan
- id
- tanggal
- user_id
- total_transaksi
- total_omzet

### 📑 Entity: Detail_Penjualan
- id
- penjualan_id
- barang_id
- qty
- subtotal

---

## 🔗 RELASI ANTAR ENTITY

- **User** 1 → * **Penjualan**
- **Penjualan** 1 → * **Detail_Penjualan**
- **Barang** 1 → * **Detail_Penjualan**

Catatan penting:
- Laporan **tidak disimpan** sebagai tabel
- Laporan dihitung dari data **Penjualan + Detail_Penjualan** berdasarkan periode

---

## 📊 DIAGRAM ERD (VISUAL – MERMAID)

```mermaid
erDiagram
    USER ||--o{ PENJUALAN : membuat
    PENJUALAN ||--o{ DETAIL_PENJUALAN : memiliki
    BARANG ||--o{ DETAIL_PENJUALAN : dijual_dalam

    USER {
        int id
        string nama
        string role
    }

    BARANG {
        int id
        string nama_barang
        int harga_jual
        int stok
        string status
    }

    PENJUALAN {
        int id
        date tanggal
        int total_transaksi
        int total_omzet
    }

    DETAIL_PENJUALAN {
        int id
        int qty
        int subtotal
    }
```

---

# 🧭 APP FLOW DIAGRAM (VISUAL)

## 👩‍🍳 Flow — Penjaga Kantin

```mermaid
flowchart TD
    A[Login] --> B[Dashboard Penjaga]
    B --> C[Input Penjualan]
    C --> D[Stok Berkurang Otomatis]
    D --> E[Tutup Hari]
    E --> F[Laporan Harian Tersimpan]
```

---

## 🧑‍💼 Flow — Yayasan / Admin

```mermaid
flowchart TD
    A[Login] --> B[Dashboard Yayasan]
    B --> C[Pilih Periode Laporan]
    C --> D[Lihat Laporan]
```

---

## ✅ PRINSIP DESAIN DATA & FLOW

- Satu hari = satu rangkaian penjualan
- Penjaga **tidak bisa mengubah** data setelah Tutup Hari
- Yayasan **read-only**
- Semua laporan diturunkan dari data transaksi (single source of truth)

---

Dokumen ini menjadi **acuan visual utama** untuk:
- pengembangan Antigravity
- validasi logika aplikasi
- komunikasi dengan non-teknis (yayasan / penjaga)

