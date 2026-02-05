-- Migration: Add pengeluaran table

CREATE TABLE IF NOT EXISTS public.pengeluaran (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tanggal date NOT NULL DEFAULT current_date,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  kategori text NOT NULL CHECK (kategori IN ('pembelian_stok', 'operasional', 'lainnya')),
  keterangan text NOT NULL,
  jumlah integer NOT NULL CHECK (jumlah > 0),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pengeluaran ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Keeper can manage pengeluaran" ON public.pengeluaran
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'canteen_keeper')
  );

CREATE POLICY "Admin can view pengeluaran" ON public.pengeluaran
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'foundation_admin')
  );
