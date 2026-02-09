-- Migration: Add kategori table and dynamic relationship

-- 1. Create kategori table
CREATE TABLE IF NOT EXISTS public.kategori (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    nama text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.kategori ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Everyone (authenticated users) can view categories
CREATE POLICY "Everyone can view kategori" ON public.kategori
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only Foundation Admin can manage (insert/update/delete) categories
CREATE POLICY "Admin can manage kategori" ON public.kategori
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'foundation_admin')
    );

-- 4. Seed default data
INSERT INTO public.kategori (nama) VALUES
    ('makanan'),
    ('minuman'),
    ('snack')
ON CONFLICT (nama) DO NOTHING;

-- 5. Migrate any other existing categories from barang table (if any)
INSERT INTO public.kategori (nama)
SELECT DISTINCT kategori FROM public.barang
WHERE kategori NOT IN ('makanan', 'minuman', 'snack')
ON CONFLICT (nama) DO NOTHING;

-- 6. Modify barang table
-- Drop the old check constraint
ALTER TABLE public.barang DROP CONSTRAINT IF EXISTS barang_kategori_check;

-- Add foreign key constraint to ensure data integrity
-- We reference 'nama' because the application uses the name string for storage/display currently
ALTER TABLE public.barang
ADD CONSTRAINT barang_kategori_fkey
FOREIGN KEY (kategori)
REFERENCES public.kategori (nama)
ON UPDATE CASCADE
ON DELETE RESTRICT;
