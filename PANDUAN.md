# Panduan Aplikasi Pantau Lampu Pesantren
**Pesantren Tahfizh Al-Bassam**

Aplikasi sistem evaluasi penerangan, manajemen fitting QR code, inventori stok lampu, dan pelaporan WhatsApp terintegrasi.

---

## 🚀 Fitur Unggulan

1. **Evaluasi Ketahanan Merk & Kenakalan Santri**:
   - Menghitung masa pakai nyata (dalam hari) vs klaim spesifikasi pabrik.
   - Deteksi dini lampu rusak sebelum waktunya (*rusak dini*).
   - Menandai indikasi lampu pecah/fiting hilang karena ulah santri di asrama.
   - Mengidentifikasi **Top Titik Rawan** yang sering rusak berulang.

2. **Cetak Label Fitting A4 (Preset 12 Label / Lembar)**:
   - Format 3 kolom &times; 4 baris = pas 12 stiker per lembar A4.
   - Berisi nama pesantren, QR code tajam, kode fitting besar (`F-001`), lokasi pemasangan, merk lampu, dan teks peringatan santri.
   - Panduan garis potong putus-putus rapi untuk gunting/cutter.
   - Pilihan "Mulai di kotak ke-X" untuk memanfaatkan kertas stiker yang sudah terpakai sebagian.

3. **Pindai QR Code di Lapangan**:
   - Scan menggunakan kamera smartphone atau webcam laptop secara langsung.
   - Terdapat efek suara *beep* penanda scan berhasil.
   - Opsi input cepat kode fitting manual (misal: ketik `F-004`).
   - Langsung membuka riwayat titik lampu dan tombol cepat **Catat Penggantian**.

4. **Inventori Stok Gudang (Masuk & Keluar)**:
   - Catat stok masuk (pembelian toko atau donasi donatur).
   - Catat stok keluar (manual maupun otomatis terpotong saat penggantian fitting).
   - Indikator peringatan otomatis jika stok gudang menipis (< 5 pcs).

5. **Laporan Grafik Interaktif & Salin WhatsApp (Copy WA)**:
   - 3 Grafik visual interaktif:
     1. Komposisi Alasan Kerusakan (Putus Wajar vs Dimainkan Santri vs Konslet).
     2. Daya Tahan Rata-Rata per Merk Lampu (Philips, Hannochs, Osram, dll).
     3. Lokasi/Ruangan Paling Rawan Kerusakan.
   - **Tombol Salin Laporan ke WhatsApp**: Menghasilkan pesan teks ber-emoji rapi siap kirim ke Mudir/Pengasuh atau grup Sarpras Pesantren dalam 1 klik!

---

## 💻 Cara Menjalankan di Komputer Lokal (XAMPP)

1. Pastikan modul **Apache** di XAMPP Control Panel sudah berjalan (**Start**).
2. Buka browser (Chrome, Edge, atau Firefox) lalu buka alamat:
   ```text
   http://localhost/lampu/
   ```
3. Aplikasi akan langsung terbuka dengan **Mode Simulasi Pesantren** (lengkap dengan data contoh asrama, masjid, madrasah, fitting, stok lampu, dan grafik). Anda bisa langsung mencoba seluruh fiturnya tanpa hambatan!

---

## 🖨️ Panduan Cetak Label A4 (12 Label)

1. Buka menu **Cetak Label (A4)**.
2. Tentukan nomor fitting yang ingin dicetak (misal `F-001` s/d `F-012`).
3. Tekan **🖨️ Cetak Sekarang (Print / PDF)**.
4. Pada jendela pengaturan cetak browser:
   - **Destination / Tujuan:** Pilih printer Anda atau *Save as PDF*.
   - **Paper Size / Ukuran Kertas:** **A4**.
   - **Margins / Margin:** Pilih **None / Tidak Ada** (atau *Custom 0*).
   - **Scale / Skala:** **100% (Default)** (Jangan pilih *Fit to printable area*).
5. Label akan tercetak presisi 12 stiker per lembar kertas A4.

---

## ☁️ Menghubungkan ke Supabase (Database Online)

Jika Anda ingin menyimpan data secara online di cloud Supabase:

1. Buat project gratis di [supabase.com](https://supabase.com).
2. Masuk ke **SQL Editor** di dashboard Supabase, salin seluruh isi berkas `supabase/schema.sql`, lalu tekan **Run**.
3. Buka **Project Settings** &rarr; **API**, salin **Project URL** dan **anon public key**.
4. Buka berkas `js/config.js` di VS Code, lalu tempelkan URL dan Key tersebut:
   ```javascript
   SUPABASE_URL: "https://proyek-anda.supabase.co",
   SUPABASE_ANON_KEY: "eyJh...",
   ```
5. Muat ulang halaman web, lalu masuk dengan akun Supabase Anda.

---

## 🌐 Menayangkan ke Internet (Vercel)

1. Pastikan folder `c:\xampp\htdocs\lampu` sudah diunggah ke repositori GitHub Anda.
2. Buka [vercel.com](https://vercel.com) &rarr; **Add New Project**.
3. Pilih repositori GitHub Anda, lalu tekan **Deploy**.
4. Aplikasi Anda langsung aktif dan dapat diakses dari smartphone petugas sarpras di mana saja melalui alamat seperti:
   `https://lampu-pesantren.vercel.app`
