-- Create kasbon table
create table if not exists kasbon (
  id uuid default gen_random_uuid() primary key,
  nama_peminjam text not null,
  nominal integer not null,
  keterangan text,
  status text not null default 'belum_lunas' check (status in ('belum_lunas', 'lunas')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table kasbon enable row level security;

create policy "Enable read access for all authenticated users"
  on kasbon for select using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users"
  on kasbon for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users"
  on kasbon for update using (auth.role() = 'authenticated');
