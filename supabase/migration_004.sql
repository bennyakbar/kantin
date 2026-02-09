-- Migration: Allow canteen_keeper to add categories

-- 1. Drop the existing policy that only allowed admin to manage categories
DROP POLICY IF EXISTS "Admin can manage kategori" ON public.kategori;

-- 2. Create new policies
-- Admin can still do everything
CREATE POLICY "Admin can manage kategori" ON public.kategori
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'foundation_admin')
    );

-- Keepers can insert (add) new categories, but maybe not delete/update others?
-- For simplicity and meeting the requirement "add category", we allow INSERT.
CREATE POLICY "Keeper can insert kategori" ON public.kategori
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'canteen_keeper')
    );

-- Keepers can also delete what they created? Or just let Admin manage deletions?
-- The requirement is just "add". Safe to restrict DELETE to Admin only.
-- So we are done with policies.
