-- Supabase SQL Schema for Kantin App

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nama text not null,
  email text not null,
  role text not null check (role in ('canteen_keeper', 'foundation_admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Barang table
create table public.barang (
  id uuid default uuid_generate_v4() primary key,
  nama_barang text not null,
  harga_jual integer not null check (harga_jual >= 0),
  stok integer not null default 0 check (stok >= 0),
  status text not null default 'aktif' check (status in ('aktif', 'nonaktif')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Penjualan table
create table public.penjualan (
  id uuid default uuid_generate_v4() primary key,
  tanggal date not null default current_date,
  user_id uuid references public.profiles(id) not null,
  total_transaksi integer not null default 0,
  total_omzet integer not null default 0,
  is_closed boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Detail Penjualan table
create table public.detail_penjualan (
  id uuid default uuid_generate_v4() primary key,
  penjualan_id uuid references public.penjualan(id) on delete cascade not null,
  barang_id uuid references public.barang(id) not null,
  qty integer not null check (qty > 0),
  subtotal integer not null check (subtotal >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.barang enable row level security;
alter table public.penjualan enable row level security;
alter table public.detail_penjualan enable row level security;

-- Profiles: users can read own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Barang: keeper full access, admin read-only
create policy "Keeper can manage barang" on public.barang
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'canteen_keeper')
  );

create policy "Admin can view barang" on public.barang
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'foundation_admin')
  );

-- Penjualan: keeper can create/read own, admin can read all
create policy "Keeper can manage own penjualan" on public.penjualan
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'canteen_keeper')
  );

create policy "Admin can view all penjualan" on public.penjualan
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'foundation_admin')
  );

-- Detail Penjualan: keeper can create/read, admin can read all
create policy "Keeper can manage detail_penjualan" on public.detail_penjualan
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'canteen_keeper')
  );

create policy "Admin can view all detail_penjualan" on public.detail_penjualan
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'foundation_admin')
  );

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nama, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nama', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'canteen_keeper')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
