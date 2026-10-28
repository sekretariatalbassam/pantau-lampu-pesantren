# 📖 Buku Panduan Penggunaan Aplikasi Pantau Lampu Pesantren
**Pesantren Tahfizh Al-Bassam**

Aplikasi sistem evaluasi ketahanan penerangan, manajemen dudukan fitting QR code, inventori stok gudang lampu, dan pelaporan WhatsApp otomatis berbasis Web / Smartphone PWA.

---

## 🌐 Tautan Aplikasi Resmi

* **Tautan Utama (Vercel Production):**  
  👉 [https://pantau-lampu-pesantren.vercel.app](https://pantau-lampu-pesantren.vercel.app)
* **Tautan Cadangan (GitHub Pages):**  
  👉 [https://sekretariatalbassam.github.io/pantau-lampu-pesantren/](https://sekretariatalbassam.github.io/pantau-lampu-pesantren/)

---

## 🚀 Alur Kerja Standar (SOP Pengelolaan Lampu di Pesantren)

```
[1. Master Data] ──▶ [2. Pasang Fitting & Stiker QR] ──▶ [3. Patroli / Scan HP] ──▶ [4. Rekap WhatsApp]
 (Lokasi & Lampu)       (Cetak Stiker A4 isi 12)          (Catat Kasus Santri)       (Laporan ke Mudir)
```

1. **Tahap Persiapan Awal**:
   * Input nama Gedung, Lantai, dan Ruangan di menu **Master Lokasi** (atau import sekaligus dari Excel).
   * Input merk dan spesifikasi lampu yang biasa dibeli di menu **Jenis Lampu**.
2. **Tahap Registrasi Fitting & Cetak Stiker**:
   * Daftarkan nomor fitting (misal `F-001` s/d `F-050`) di menu **Fitting** (bisa menggunakan fitur `+ Buat Banyak` atau `📥 Import CSV`).
   * Buka menu **Cetak 12 Label A4**, cetak menggunakan kertas stiker A4, lalu tempelkan di samping dudukan fitting plafon.
3. **Tahap Pengadaan & Stok Gudang**:
   * Setiap ada pembelian atau droping donasi lampu, catat di menu **Stok Gudang &rsaquo; + Stok Masuk**.
4. **Tahap Penggantian di Lapangan (Mobile)**:
   * Petugas/santri pengurus membuka aplikasi lewat HP &rsaquo; klik tombol **Pindai QR**.
   * Arahkan kamera ke stiker fitting &rsaquo; HP berbunyi *beep* &rsaquo; pilih jenis kerusakan (Habis Masa Pakai / Kenakalan Santri / Konslet / Hilang) &rsaquo; pasang lampu baru.
   * Stok gudang otomatis terpotong 1 pcs secara real-time.
5. **Tahap Evaluasi & Pelaporan**:
   * Buka menu **Laporan & WA** untuk melihat grafik merk lampu mana yang paling awet dan ruangan mana yang sering dirusak santri.
   * Klik tombol **📲 Kirim Laporan WhatsApp** untuk mengirimkan ringkasan rapi ke pimpinan pesantren.

---

## 📥 Panduan Fitur Export & Import Excel (CSV)

Fitur ini memudahkan pengurus menginput atau mencadangkan puluhan data ruangan dan ratusan titik lampu sekaligus menggunakan Microsoft Excel atau Google Sheets.

### A. Master Lokasi Pesantren
1. Buka menu **Master Lokasi**.
2. Klik tombol **📄 Template CSV** untuk mengunduh format standar:
   | Gedung | Lantai | Ruang | Keterangan |
   | :--- | :--- | :--- | :--- |
   | Masjid Jami | 1 | Ruang Sholat Utama | Plafon imam & shaf depan |
   | Asrama Putra | 1 | Kamar Abu Bakar (101) | Kamar santri putra |
   | Madrasah | 2 | Kelas 3 Tahfizh | Ruang kelas belajar |
3. Buka file tersebut di Excel, isi data ruangan pesantren Anda, lalu simpan (*Save As*) format **CSV (Comma Delimited)**.
4. Kembali ke aplikasi, klik **📥 Import CSV**, pilih file, lalu pilih:
   * **Tambahkan ke data yang ada** (menambah tanpa menghapus yang lama), atau
   * **Ganti semua data** (mengosongkan lokasi lama).
5. Klik **Mulai Proses Import**.

### B. Titik Fitting Lampu
1. Buka menu **💡 Fitting**.
2. Klik tombol **📥 Import** &rsaquo; **Unduh Contoh Template CSV**:
   | Kode_Fitting | Gedung | Lantai | Ruang | Merk_Lampu | Jenis_Lampu | Watt | Tanggal_Pasang | Pemasang | Status | Keterangan |
   | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
   | `F-001` | Asrama Putra | 1 | Kamar Abu Bakar (101) | Philips | LED MyCare Bulb | 10 | 2026-05-10 | Ust. Ahmad | aktif | Plafon tengah |
   | `F-002` | Masjid Jami | 1 | Ruang Sholat Utama | Philips | LED MyCare Bulb | 14 | 2026-01-15 | Pak Joko | aktif | Shaf depan |
3. **Fitur Otomatis Pintar**: Jika nama Gedung atau Merk Lampu di file CSV belum terdaftar di Master, sistem akan **otomatis mendaftarkannya** ke database!
4. Klik **Mulai Proses Import**. Seluruh titik fitting akan langsung tersusun rapi berurutan.

---

## 🏷️ Panduan Cetak Stiker QR Label A4 (Ukuran 12 Label)

Menu ini didesain presisi untuk kertas stiker label A4 isi 12 kotak per lembar (3 kolom &times; 4 baris, ukuran standar label stiker pasaran):

1. Masuk ke menu **🏷️ Cetak 12 Label A4**.
2. Masukkan nomor fitting yang ingin dicetak:
   * Contoh: *Dari Nomor Fitting:* **1** &mdash; *Sampai Nomor Fitting:* **12** (akan mengisi pas 1 lembar A4 penuh).
3. Anda juga bisa mengatur *"Mulai cetak pada kotak ke-X"* jika kertas stiker Anda sebelumnya sudah terpakai beberapa kotak.
4. Klik tombol biru **🖨️ Cetak Sekarang (Print / PDF)**.
5. **Pengaturan Jendela Print Browser:**
   * **Kertas / Paper Size:** `A4`
   * **Margin:** `None` (Tanpa Margin) atau `Default`
   * **Skala / Scale:** `100%` (*Actual Size*)
   * **Options:** Centang *"Background graphics"* agar warna bingkai dan teks tercetak jelas.
6. Gunting atau lepas stiker sesuai garis panduan potong, lalu tempelkan di plafon sebelah fitting lampu.

---

## 📷 Panduan Pindai QR di Lapangan (Smartphone)

1. Buka aplikasi di HP (disarankan tap *"Tambahkan ke Layar Utama / Add to Home Screen"* di browser Chrome/Safari).
2. Tekan **tombol bundar kamera (FAB)** di bagian tengah bawah layar.
3. Tekan **Mulai Kamera** (tersedia tombol **🔄 Putar** untuk mengganti kamera belakang/depan).
4. Sorotkan kamera ke stiker QR fitting lampu.
5. Saat QR terbaca:
   * HP akan membunyikan nada *beep*.
   * Layar langsung memunculkan detail fitting: lokasi, merk lampu, tanggal pasang, usia pemakaian, dan status.
6. Jika lampu mati atau rusak, klik tombol **Catat Penggantian Baru**:
   * **Penyebab Kerusakan:**
     * `⏳ Putus Wajar`: Habis masa pakai alami.
     * `⚽ Dimainkan Santri`: Lampu pecah terkena bola/bantal, atau fiting dibongkar santri untuk sambungan kipas/charger. Centang opsi *"⚠️ Indikasi kenakalan santri"*.
     * `🔍 Hilang`: Lampu di lorong/selasar hilang dipindahkan.
     * `⚡ Konslet`: Gangguan listrik atau tetesan atap bocor.
     * `🔌 Fiting Rusak`: Dudukan kendur/terbakar.
   * Centang *"Potong 1 pcs dari stok gudang"* &rsaquo; klik **Simpan Catatan**.

---

## 📊 Format Laporan WhatsApp Otomatis

Di menu **📈 Laporan & WA**, pengurus dapat membagikan laporan langsung ke WhatsApp pimpinan dengan 1 ketukan:

Contoh format pesan WhatsApp yang dihasilkan:
```text
📊 LAPORAN EVALUASI & STOK LAMPU PESANTREN
🏛️ Pesantren Tahfizh Al-Bassam
📅 Rabu, 28 Oktober 2026
━━━━━━━━━━━━━━━━━━━━

💡 1. STATUS TITIK LAMPU
• Total Dudukan/Fitting : 48 titik
• Lampu Menyala Aktif   : 46 titik
• Fitting Kosong/Mati   : 2 titik ⚠️ (Perlu diganti)

⚠️ 2. EVALUASI KERUSAKAN & KENAKALAN SANTRI
• Total Kejadian Kerusakan : 6 kali
  - ⏳ Putus Wajar / Habis Umur : 3 kali
  - ⚽ Dimainkan Santri / Hilang : 2 kali ⚠️ (Perlu Perhatian Khusus)
  - ⚡ Konslet / Tegangan Listrik : 1 kali

🚨 TOP TITIK RAWAN (Sering Rusak/Hilang):
1. F-004 — Asrama Putra (Kamar Umar 102) (2x rusak, 2x ulah santri)

🏆 3. EVALUASI MERK LAMPU (DAYA TAHAN)
• Philips: Rata-rata 410 hari (0% rusak dini)
• Hannochs: Rata-rata 185 hari (25% rusak dini)

📦 4. SISA STOK GUDANG
• Philips LED Bulb 10W : 14 pcs ✅
• Philips LED Bulb 14W : 3 pcs ⚠️ (Menipis)
━━━━━━━━━━━━━━━━━━━━
📌 Rekomendasi:
- Beri arahan tata tertib asrama untuk Kamar 102.
- Pasang cover akrilik pelindung fitting di koridor.
```

---

## 🧹 Tombol Pembersihan Data Transaksi

Jika pengurus telah selesai mencoba-coba (*testing*) dan ingin mengosongkan kembali data fitting, riwayat penggantian, serta mutasi stok untuk memulai pendataan riil:
1. Buka menu **Menu** di pojok kanan bawah HP (atau drawer menu).
2. Klik tombol **🧹 Bersihkan Data Transaksi**.
3. Konfirmasi penghapusan. Seluruh transaksi akan kembali bersih menjadi 0, sementara Master Lokasi dan Jenis Lampu tetap tersimpan aman.
