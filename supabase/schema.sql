-- ============================================================
--  PANTAU LAMPU PESANTREN - Pesantren Tahfizh Al-Bassam
--  Struktur Database Supabase PostgreSQL
--  Salin seluruh isi berkas ini ke Supabase > SQL Editor > Tekan RUN
-- ============================================================

-- 1. PROFIL PENGGUNA (Admin / Petugas)
create table if not exists public.profil (
  id         uuid primary key references auth.users(id) on delete cascade,
  nama       text,
  peran      text not null default 'petugas' check (peran in ('admin', 'petugas')),
  created_at timestamptz not null default now()
);

-- Otomatis buat profil saat ada pendaftaran akun baru
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profil (id, nama, peran)
  values (new.id, coalesce(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)), 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fungsi cek admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profil where id = auth.uid() and peran = 'admin');
$$;

-- 2. MASTER DATA LOKASI
create table if not exists public.lokasi (
  id         bigint generated always as identity primary key,
  gedung     text not null,            -- Asrama Putra, Masjid, Madrasah, dll
  lantai     text,                     -- 1, 2, Dasar
  ruang      text,                     -- Kamar 101, Kamar Mandi, dsb
  keterangan text,
  created_at timestamptz not null default now()
);

-- 3. MASTER JENIS LAMPU
create table if not exists public.jenis_lampu (
  id              bigint generated always as identity primary key,
  merk            text not null,       -- Philips, Hannochs, Osram
  jenis           text not null,       -- LED Bulb, TL Neon, dll
  watt            int,
  masa_pakai_jam  int,                 -- Estimasi jam nyala (mis. 15000)
  keterangan      text,
  created_at      timestamptz not null default now()
);

-- 4. TITIK DUDUKAN FITTING (F-001, F-002, ...)
create table if not exists public.fitting (
  id              bigint generated always as identity primary key,
  kode            text not null unique,
  lokasi_id       bigint references public.lokasi(id) on delete set null,
  jenis_lampu_id  bigint references public.jenis_lampu(id) on delete set null,
  tanggal_pasang  date,
  pemasang        text,
  status          text not null default 'aktif' check (status in ('aktif', 'kosong', 'nonaktif')),
  keterangan      text,
  created_at      timestamptz not null default now()
);
create index if not exists fitting_lokasi_idx on public.fitting (lokasi_id);

-- 5. RIWAYAT PENGGANTIAN & EVALUASI KERUSAKAN
create table if not exists public.penggantian (
  id                  bigint generated always as identity primary key,
  fitting_id          bigint not null references public.fitting(id) on delete cascade,
  tanggal             date not null default current_date,
  alasan              text not null check (alasan in ('habis_masa_pakai', 'dimainkan_santri', 'hilang', 'konslet', 'fiting_rusak', 'pecah', 'lainnya')),
  catatan             text,
  foto_path           text,
  jenis_lama_id       bigint references public.jenis_lampu(id) on delete set null,
  jenis_baru_id       bigint references public.jenis_lampu(id) on delete set null,
  tanggal_pasang_lama date,
  usia_hari           int,
  rusak_dini          boolean default false,
  indikasi_santri     boolean default false,
  pemasang            text,
  dibuat_oleh         uuid default auth.uid() references auth.users(id) on delete set null,
  created_at          timestamptz not null default now()
);
create index if not exists penggantian_fitting_idx on public.penggantian (fitting_id);
create index if not exists penggantian_tanggal_idx on public.penggantian (tanggal);

-- 6. INVENTORI MUTASI STOK GUDANG
create table if not exists public.stok_mutasi (
  id              bigint generated always as identity primary key,
  tanggal         date not null default current_date,
  jenis_lampu_id  bigint not null references public.jenis_lampu(id) on delete cascade,
  arah            text not null check (arah in ('masuk', 'keluar')),
  jumlah          int not null check (jumlah > 0),
  keterangan      text,
  dibuat_oleh     text,
  created_at      timestamptz not null default now()
);
create index if not exists stok_mutasi_jenis_idx on public.stok_mutasi (jenis_lampu_id);

-- 7. KEAMANAN AKSES (Row Level Security)
alter table public.profil enable row level security;
drop policy if exists profil_baca on public.profil;
create policy profil_baca on public.profil for select to authenticated using (true);
drop policy if exists profil_ubah on public.profil;
create policy profil_ubah on public.profil for update to authenticated using (true) with check (true);

do $$
declare t text;
begin
  foreach t in array array['lokasi', 'jenis_lampu', 'fitting', 'penggantian', 'stok_mutasi'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', t || '_baca', t);
    execute format('create policy %I on public.%I for select to authenticated using (true)', t || '_baca', t);

    execute format('drop policy if exists %I on public.%I', t || '_tambah', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (true)', t || '_tambah', t);

    execute format('drop policy if exists %I on public.%I', t || '_ubah', t);
    execute format('create policy %I on public.%I for update to authenticated using (true) with check (true)', t || '_ubah', t);

    execute format('drop policy if exists %I on public.%I', t || '_hapus', t);
    execute format('create policy %I on public.%I for delete to authenticated using (true)', t || '_hapus', t);
  end loop;
end $$;

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ============================================================
-- SEED DATA AWAL (Opsional: Bila ingin data contoh di Supabase)
-- ============================================================
insert into public.lokasi (gedung, lantai, ruang, keterangan) values
  ('Asrama Putra', '1', 'Kamar 101 (Abu Bakar)', 'Kamar santri putra'),
  ('Asrama Putra', '1', 'Kamar 102 (Umar)', 'Kamar santri putra'),
  ('Asrama Putra', '2', 'Kamar 201 (Utsman)', 'Kamar santri putra lt. 2'),
  ('Asrama Putra', '2', 'Kamar 202 (Ali)', 'Area Rawan Kenakalan Santri'),
  ('Asrama Putra', '1', 'Kamar Mandi & Wudhu Putra', 'Area lembap/basah'),
  ('Asrama Putra', '2', 'Koridor & Selasar Lt. 2', 'Lalu lalang santri'),
  ('Masjid Jami', '1', 'Ruang Utama Sholat', 'Plafon utama'),
  ('Madrasah', '1', 'Kelas 1 Tahfizh', 'Ruang belajar')
on conflict do nothing;

insert into public.jenis_lampu (merk, jenis, watt, masa_pakai_jam, keterangan) values
  ('Philips', 'LED MyCare', 14, 15000, 'Tahan lama'),
  ('Philips', 'LED MyCare', 10, 15000, 'Kamar santri'),
  ('Hannochs', 'Premier LED', 12, 10000, 'Ekonomis'),
  ('Hannochs', 'Vario LED', 9, 8000, 'Koridor'),
  ('Osram', 'LED Value', 12, 12000, 'Teras')
on conflict do nothing;
