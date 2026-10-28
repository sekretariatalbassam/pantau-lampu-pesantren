/* ============================================================
   Halaman Panduan Penggunaan Aplikasi Pantau Lampu Pesantren
   Format: Buku Panduan Interaktif Khusus Smartphone & Desktop
   ============================================================ */

Pages.panduan = async function (el) {
  el.innerHTML = `
    <div class="page-head">
      <div>
        <h2>📖 Panduan Penggunaan Lengkap</h2>
        <p class="muted text-sm">Standar Operasional Prosedur (SOP) pengelolaan & evaluasi lampu pesantren.</p>
      </div>
    </div>

    <!-- Navigasi Tab Cepat Panduan -->
    <div class="card toolbar-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));">
      <a href="#sop-alur" class="btn small" style="text-align:center;">🌟 1. Alur SOP</a>
      <a href="#sop-master" class="btn small" style="text-align:center;">🏛️ 2. Lokasi & Fitting</a>
      <a href="#sop-label" class="btn small" style="text-align:center;">🏷️ 3. Cetak Label A4</a>
      <a href="#sop-stok" class="btn small" style="text-align:center;">📦 4. Stok Gudang</a>
      <a href="#sop-scan" class="btn small" style="text-align:center;">📷 5. Scan & Ganti</a>
      <a href="#sop-laporan" class="btn small" style="text-align:center;">📈 6. Laporan WA</a>
      <a href="#sop-excel" class="btn small" style="text-align:center;">📥 7. Export/Import</a>
    </div>

    <div class="panduan-content" style="display:flex;flex-direction:column;gap:18px;margin-top:16px;">
      
      <!-- Bab 1 -->
      <section class="card" id="sop-alur">
        <div class="card-header-flex">
          <h3>🌟 Bab 1: Alur Kerja Utama (SOP Lapangan)</h3>
        </div>
        <p>Aplikasi ini dirancang untuk memudahkan teknisi dan bagian Sarpras Pesantren dalam 4 tahapan siklus:</p>
        
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px;">
          <div style="background:#f8fafc;border-left:4px solid #0f766e;padding:10px 14px;border-radius:4px;">
            <b>Tahap 1: Registrasi & Pelabelan Awal</b>
            <p class="text-sm muted" style="margin:4px 0 0;">Input master lokasi ruangan, buat kode fitting (misal F-001 s/d F-050), lalu cetak stiker QR code A4 dan tempel di samping dudukan lampu plafon.</p>
          </div>
          <div style="background:#f8fafc;border-left:4px solid #0284c7;padding:10px 14px;border-radius:4px;">
            <b>Tahap 2: Pembelian & Manajemen Stok</b>
            <p class="text-sm muted" style="margin:4px 0 0;">Setiap ada pengadaan lampu baru (beli atau donasi), catat di menu <b>Stok Gudang &rsaquo; + Stok Masuk</b>.</p>
          </div>
          <div style="background:#f8fafc;border-left:4px solid #d97706;padding:10px 14px;border-radius:4px;">
            <b>Tahap 3: Patroli & Penggantian Lampu di Lapangan</b>
            <p class="text-sm muted" style="margin:4px 0 0;">Saat ada lampu mati di asrama/masjid, petugas membuka kamera scan HP &rsaquo; scan QR fitting &rsaquo; catat alasan (wajar/kenakalan santri). Stok gudang otomatis berkurang 1 pcs.</p>
          </div>
          <div style="background:#f8fafc;border-left:4px solid #16a34a;padding:10px 14px;border-radius:4px;">
            <b>Tahap 4: Evaluasi Berkala & Laporan WhatsApp</b>
            <p class="text-sm muted" style="margin:4px 0 0;">Sistem otomatis menghitung merk lampu mana yang paling awet dan ruangan mana yang sering dirusak santri. Klik 1 tombol untuk kirim rekapan laporan langsung ke WhatsApp pimpinan.</p>
          </div>
        </div>
      </section>

      <!-- Bab 2 -->
      <section class="card" id="sop-master">
        <div class="card-header-flex">
          <h3>🏛️ Bab 2: Input Master Lokasi & Titik Fitting</h3>
        </div>
        <h4>A. Mengatur Master Lokasi:</h4>
        <p class="text-sm">Buka menu <b>Master Lokasi</b>. Lokasi diatur dalam hierarki 3 tingkatan:</p>
        <ul class="text-sm" style="padding-left:20px;margin:6px 0 12px;">
          <li><b>Gedung:</b> Asrama Putra, Asrama Putri, Masjid Jami, Madrasah, Kantor, dll.</li>
          <li><b>Lantai:</b> 1, 2, 3, Dasar.</li>
          <li><b>Ruang:</b> Kamar 101, Kamar 102, Kelas 1 Tahfizh, Ruang Wudhu, dll.</li>
        </ul>
        <p class="text-sm muted"><i>💡 Tips: Jika ruangan sangat banyak, Anda bisa langsung mengisi file Excel lalu klik tombol <b>📥 Import CSV</b>.</i></p>

        <h4 style="margin-top:14px;">B. Membuat Titik Dudukan Fitting:</h4>
        <p class="text-sm">Buka menu <b>💡 Fitting</b>. Anda punya 2 pilihan cepat:</p>
        <ul class="text-sm" style="padding-left:20px;margin:6px 0;">
          <li><b>+ Tambah:</b> Untuk menambah 1 titik fitting secara spesifik.</li>
          <li><b>+ Buat Banyak:</b> Masukkan awalan nomor (misal 1) dan jumlah (misal 30). Sistem otomatis membuat kode <code>F-001</code> s/d <code>F-030</code> dalam 1 detik!</li>
          <li><b>📥 Import CSV:</b> Upload daftar fitting langsung dari file Excel.</li>
        </ul>
      </section>

      <!-- Bab 3 -->
      <section class="card" id="sop-label">
        <div class="card-header-flex">
          <h3>🏷️ Bab 3: Cetak Stiker Label QR A4 (Isi 12 Label)</h3>
        </div>
        <p class="text-sm">Fitur ini dirancang presisi untuk ukuran kertas stiker label A4 isi 12 label (3 kolom &times; 4 baris) yang banyak dijual di toko alat tulis (misal Tom & Jerry / generic A4 12 label).</p>
        
        <div style="background:#fef3c7;padding:12px;border-radius:6px;margin:10px 0;">
          <b class="text-amber">Petunjuk Saat Mencetak (Print / Simpan PDF):</b>
          <ol class="text-sm" style="padding-left:20px;margin:6px 0 0;">
            <li>Buka menu <b>🏷️ Cetak 12 Label A4</b>.</li>
            <li>Pilih nomor fitting yang ingin dicetak (misal: Dari 1 Sampai 12).</li>
            <li>Klik tombol biru <b>🖨️ Cetak Sekarang</b>.</li>
            <li>Pada jendela print browser:
              <br>• Ukuran Kertas: <b>A4</b>
              <br>• Margin: <b>None (Tanpa Margin)</b> atau <b>Default</b>
              <br>• Skala: <b>100% (Actual Size)</b>
            </li>
          </ol>
        </div>
        <p class="text-sm muted"><b>Tips Pemasangan:</b> Tempel stiker label di plafon tepat di samping dudukan fitting agar mudah dipindai oleh kamera HP dari bawah tanpa perlu naik tangga terlalu tinggi.</p>
      </section>

      <!-- Bab 4 -->
      <section class="card" id="sop-stok">
        <div class="card-header-flex">
          <h3>📦 Bab 4: Manajemen Stok Gudang</h3>
        </div>
        <p class="text-sm">Mencegah pesantren kehabisan persediaan lampu saat malam hari atau jam sholat:</p>
        <ul class="text-sm" style="padding-left:20px;margin:6px 0 12px;">
          <li><b>Catat Stok Masuk (+):</b> Tekan tombol <code>+ Stok Masuk</code> saat pembelian toko listrik atau donatur mengirim droping lampu.</li>
          <li><b>Pemotongan Stok Otomatis:</b> Setiap kali teknisi mencatat penggantian lampu di menu <b>Ganti</b>, jika dicentang <i>"Potong 1 pcs dari stok gudang"</i>, maka stok langsung terpotong otomatis tanpa perlu dicatat manual lagi!</li>
          <li><b>Peringatan Otomatis:</b> Jika stok suatu merk &le; 5 pcs, statusnya otomatis berubah menjadi kuning <b>MENIPIS</b> atau merah <b>HABIS</b>.</li>
        </ul>
      </section>

      <!-- Bab 5 -->
      <section class="card" id="sop-scan">
        <div class="card-header-flex">
          <h3>📷 Bab 5: Pindai QR & Pencatatan Kasus di Lapangan</h3>
        </div>
        <p class="text-sm">Buka menu <b>Pindai QR</b> lewat HP (atau tekan tombol bundar kamera di tengah bawah navigasi):</p>
        
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
          <div style="background:#f0fdf4;padding:10px 14px;border-radius:6px;">
            <b>1. Pindai Langsung dengan Kamera HP:</b>
            <p class="text-sm muted" style="margin:4px 0 0;">Ketuk "Mulai Kamera", arahkan ke stiker QR fitting. HP akan berbunyi *BEEP* dan seketika membuka status lampu, tanggal pasang, dan riwayat kerusakan.</p>
          </div>
          <div style="background:#fef2f2;padding:10px 14px;border-radius:6px;">
            <b>2. Catat Kerusakan & Indikasi Kenakalan Santri:</b>
            <p class="text-sm muted" style="margin:4px 0 0;">Pilih salah satu alasan:</p>
            <ul class="text-sm" style="padding-left:20px;margin:4px 0 0;">
              <li><b>⏳ Putus Wajar:</b> Lampu mati alami karena habis masa pakai (jam nyala).</li>
              <li><b>⚽ Dimainkan Santri:</b> Lampu pecah dilempar bantal/bola, atau santri melepas fiting untuk memasang rakitan kabel kipas/charger. Centang opsi <i>"⚠️ Indikasi kenakalan santri"</i>.</li>
              <li><b>🔍 Hilang:</b> Lampu di selasar/lorong hilang dipindahkan santri ke kamar.</li>
              <li><b>⚡ Konslet:</b> Gangguan tegangan PLN atau rembesan air atap bocor.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Bab 6 -->
      <section class="card" id="sop-laporan">
        <div class="card-header-flex">
          <h3>📈 Bab 6: Grafik Ketahanan & 1-Klik Laporan WhatsApp</h3>
        </div>
        <p class="text-sm">Buka menu <b>Laporan & WA</b>. Anda akan melihat evaluasi otomatis:</p>
        <ul class="text-sm" style="padding-left:20px;margin:6px 0 12px;">
          <li><b>Grafik Ketahanan per Merk:</b> Menghitung rata-rata umur lampu dalam hari nyata. Anda bisa tahu apakah Philips benar-benar lebih awet dari merk lain di lingkungan pesantren.</li>
          <li><b>Daftar Titik Rawan:</b> Menampilkan fitting mana yang paling sering rusak berulang, beserta rekomendasi solusi (misal: perlu pasang cover akrilik pelindung).</li>
          <li><b>Kirim ke WhatsApp Pimpinan:</b> Cukup ketuk tombol hijau <b>📲 Kirim Laporan WhatsApp</b>. Teks rekap rapi ber-emoji akan otomatis disalin atau langsung membuka aplikasi WhatsApp di HP Anda!</li>
        </ul>
      </section>

      <!-- Bab 7 -->
      <section class="card" id="sop-excel">
        <div class="card-header-flex">
          <h3>📥 Bab 7: Fitur Export & Import Excel (CSV)</h3>
        </div>
        <p class="text-sm">Jika pesantren memiliki puluhan kamar dan ratusan titik lampu, Anda tidak perlu menginputnya satu per satu:</p>
        
        <div style="background:#f8fafc;padding:12px;border:1px solid #cbd5e1;border-radius:6px;margin:10px 0;">
          <b>Langkah-Langkah:</b>
          <ol class="text-sm" style="padding-left:20px;margin:6px 0 0;">
            <li>Buka menu <b>Master Lokasi</b> atau <b>Fitting</b>.</li>
            <li>Klik tombol <b>📄 Unduh Template CSV</b> (atau Export data yang ada).</li>
            <li>Buka file tersebut di <b>Microsoft Excel</b> atau <b>Google Sheets</b>.</li>
            <li>Isi nama gedung, lantai, ruang, serta kode fitting sesuai denah pesantren Anda.</li>
            <li>Simpan sebagai format <b>CSV (Comma Delimited)</b>.</li>
            <li>Kembali ke aplikasi lalu klik tombol <b>📥 Import CSV</b> &rsaquo; pilih file &rsaquo; klik <b>Mulai Import</b>!</li>
          </ol>
        </div>
        <div class="row-btn mt-2">
          <button class="btn small primary" type="button" id="btn-panduan-dl-lokasi">📄 Unduh Template Lokasi</button>
          <button class="btn small" type="button" id="btn-panduan-dl-fitting">📄 Unduh Template Fitting</button>
        </div>
      </section>

    </div>
  `;

  $('#btn-panduan-dl-lokasi', el).onclick = () => ExportImport.downloadTemplateLokasi();
  $('#btn-panduan-dl-fitting', el).onclick = () => ExportImport.downloadTemplateFitting();
};
