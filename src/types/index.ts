export type UserRole = 'canteen_keeper' | 'foundation_admin'

export interface UserProfile {
    id: string
    email: string
    nama: string
    role: UserRole
    created_at: string
}

export type Kategori = 'makanan' | 'minuman' | 'snack'
export type Satuan = 'pcs' | 'bungkus' | 'botol' | 'porsi' | 'cup' | 'kotak'

export interface Barang {
    id: string
    nama_barang: string
    kategori: Kategori
    satuan: Satuan
    harga_modal: number
    harga_jual: number
    stok: number
    status: 'aktif' | 'nonaktif'
    created_at: string
    updated_at: string
}

export const KATEGORI_OPTIONS: { value: Kategori; label: string }[] = [
    { value: 'makanan', label: 'Makanan' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'snack', label: 'Snack' },
]

export const SATUAN_OPTIONS: { value: Satuan; label: string }[] = [
    { value: 'pcs', label: 'Pcs' },
    { value: 'bungkus', label: 'Bungkus' },
    { value: 'botol', label: 'Botol' },
    { value: 'porsi', label: 'Porsi' },
    { value: 'cup', label: 'Cup' },
    { value: 'kotak', label: 'Kotak' },
]
