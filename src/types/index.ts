export type UserRole = 'canteen_keeper' | 'foundation_admin'

export interface UserProfile {
    id: string
    email: string
    nama: string
    role: UserRole
    created_at: string
}

// Kategori is now dynamic, but we keep the string type for wider compatibility in frontend
// until fully refactored. Ideally it should be just string.
export type Kategori = string
export type Satuan = 'pcs' | 'bungkus' | 'botol' | 'porsi' | 'cup' | 'kotak'

export interface KategoriRow {
    id: string
    nama: string
    created_at: string
}

export interface Barang {
    id: string
    nama_barang: string
    kategori: string // changed from specific union type to string
    satuan: Satuan
    harga_modal: number
    harga_jual: number
    stok: number
    status: 'aktif' | 'nonaktif'
    created_at: string
    updated_at: string
}

// REMOVED KATEGORI_OPTIONS as they are now dynamic


export const SATUAN_OPTIONS: { value: Satuan; label: string }[] = [
    { value: 'pcs', label: 'Pcs' },
    { value: 'bungkus', label: 'Bungkus' },
    { value: 'botol', label: 'Botol' },
    { value: 'porsi', label: 'Porsi' },
    { value: 'cup', label: 'Cup' },
    { value: 'kotak', label: 'Kotak' },
]
