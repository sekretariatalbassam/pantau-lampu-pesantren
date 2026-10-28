/* ============================================================
   Halaman Beranda: Dashboard Mobile First Monitoring Lampu
   ============================================================ */

Pages.beranda = async function (el) {
  const fitting = await DataStore.getFitting();
  const penggantian = await DataStore.getPenggantian();
  const stok = await DataStore.getStokRingkasan();
  const evaluasiMerk = await DataStore.getEvaluasiMerk();
  const titikRawan = await DataStore.getEvaluasiTitikRawan();

  const totalFitting = fitting.length;
  const nAktif = fitting.filter(f => f.status === 'aktif').length;
  const nKosong = fitting.filter(f => f.status === 'kosong').length;

  const nSantri = penggantian.filter(p => p.alasan === 'dimainkan_santri' || p.alasan === 'hilang' || p.indikasi_santri).length;
  const stokMenipis = stok.filter(s => s.status_stok !== 'aman');

  el.innerHTML = `
    <div class="beranda-header">
      <div>
        <h2>Assalamu'alaikum 👋</h2>
        <p class="muted text-sm">${esc(CONFIG.NAMA_LEMBAGA)}</p>
      </div>
    </div>

    <!-- Alert / Peringatan Segera di Layar HP -->
    ${totalFitting === 0 ? `
      <div class="card" style="background:#f0fdf4;border-color:#bbf7d0;margin-bottom:16px;">
        <h3 style="color:#166534;margin-top:0;">🚀 Aplikasi Siap Digunakan!</h3>
        <p class="text-sm" style="color:#14532d;margin:4px 0 12px;">Seluruh data simulasi telah dibersihkan. Anda sekarang siap mencatat data nyata penerangan pesantren:</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="#/fitting" class="btn small primary" style="justify-content:flex-start;">1. 💡 Daftarkan Titik Fitting Lampu</a>
          <a href="#/stok" class="btn small" style="justify-content:flex-start;">2. 📦 Catat Stok Awal Gudang Lampu</a>
          <a href="#/label" class="btn small" style="justify-content:flex-start;">3. 🏷️ Cetak Stiker Label QR A4 untuk Ditempel di Plafon</a>
          <a href="#/panduan" class="btn small" style="justify-content:flex-start;background:#e0e7ff;color:#4338ca;border-color:#c7d2fe;">4. 📖 Baca Panduan & SOP Penggunaan</a>
        </div>
      </div>` : ''}

    ${nKosong > 0 ? `
      <div class="alert-box danger">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <strong>${nKosong} titik lampu mati / kosong!</strong>
          <p>Memerlukan penggantian lampu baru segera.</p>
        </div>
        <a href="#/penggantian?tambah=1" class="btn small primary">Ganti</a>
      </div>` : ''}

    ${nSantri > 0 ? `
      <div class="alert-box warn">
        <div class="alert-icon">⚽</div>
        <div class="alert-content">
          <strong>${nSantri} kejadian ulah santri tercatat!</strong>
          <p>Lampu pecah dimainkan atau fiting dibongkar santri.</p>
        </div>
        <a href="#/laporan" class="btn small">Cek</a>
      </div>` : ''}

    <!-- 4 Kartu Statistik Ringkas (Bisa Ditekan di HP) -->
    <div class="stats-grid">
      <a href="#/fitting" class="stat-card" style="text-decoration:none;color:inherit;">
        <div class="stat-meta">
          <span class="stat-title">Fitting</span>
          <span class="stat-badge info">${totalFitting}</span>
        </div>
        <b class="stat-value text-primary">${totalFitting}</b>
        <span class="stat-sub">Titik dudukan berlabel &rsaquo;</span>
      </a>

      <a href="#/fitting" class="stat-card" style="text-decoration:none;color:inherit;">
        <div class="stat-meta">
          <span class="stat-title">Menyala</span>
          <span class="stat-badge ok">${nAktif}</span>
        </div>
        <b class="stat-value text-ok">${nAktif}</b>
        <span class="stat-sub">${Math.round((nAktif / (totalFitting || 1)) * 100)}% penerangan aktif &rsaquo;</span>
      </a>

      <a href="#/laporan" class="stat-card" style="text-decoration:none;color:inherit;">
        <div class="stat-meta">
          <span class="stat-title">Ulah Santri</span>
          <span class="stat-badge danger">${nSantri}</span>
        </div>
        <b class="stat-value text-danger">${nSantri}</b>
        <span class="stat-sub">Lampu pecah/lepas &rsaquo;</span>
      </a>

      <a href="#/stok" class="stat-card" style="text-decoration:none;color:inherit;">
        <div class="stat-meta">
          <span class="stat-title">Stok Gudang</span>
          <span class="stat-badge">${stok.reduce((acc, s) => acc + s.sisa, 0)}</span>
        </div>
        <b class="stat-value text-amber">${stok.reduce((acc, s) => acc + s.sisa, 0)}</b>
        <span class="stat-sub">Pcs lampu siap pakai &rsaquo;</span>
      </a>
    </div>

    <!-- Tombol Akses Cepat Mobile -->
    <div class="row-btn mb-3" style="margin-bottom:14px;">
      <a href="#/scan" class="btn primary" style="flex:1;">📷 Pindai QR</a>
      <a href="#/penggantian?tambah=1" class="btn success" style="flex:1;">🔧 Catat Ganti</a>
      <button class="btn" id="btn-quick-wa" type="button" style="flex:1;">💬 Laporan WA</button>
    </div>

    <!-- Analitik Beranda -->
    <div class="dashboard-grid">
      <!-- Kolom 1: Titik Rawan -->
      <div class="card">
        <div class="card-header-flex">
          <h3>🚨 Titik Rawan Sering Rusak</h3>
          <a href="#/laporan" class="text-sm">Lihat semua &rsaquo;</a>
        </div>
        
        <div class="list-rawan">
          ${titikRawan.length ? titikRawan.slice(0, 3).map((r, i) => `
            <div class="item-rawan">
              <div class="rawan-rank">${i + 1}</div>
              <div class="rawan-info">
                <strong>${esc(r.fitting.kode)} — ${esc(labelLokasi(r.fitting.lokasi) || 'Tanpa Lokasi')}</strong>
                <small class="muted">${esc(labelJenis(r.fitting.jenis_lampu) || '-')}</small>
              </div>
              <div class="rawan-stat">
                <span class="badge ${r.karena_santri > 0 ? 'danger' : 'warn'}">${r.jumlah_rusak}x Rusak</span>
              </div>
            </div>`).join('') : '<p class="muted text-sm py-2">Belum ada riwayat kerusakan.</p>'}
        </div>
      </div>

      <!-- Kolom 2: Ketahanan Merk -->
      <div class="card">
        <div class="card-header-flex">
          <h3>🏆 Ketahanan Merk Lampu</h3>
          <a href="#/laporan" class="text-sm">Analisis &rsaquo;</a>
        </div>
        
        <div class="list-merk">
          ${evaluasiMerk.some(m => m.total_pergantian > 0) ? evaluasiMerk.filter(m => m.total_pergantian > 0).slice(0, 3).map((m) => `
            <div class="item-merk">
              <div class="merk-nama">
                <strong>${esc(m.merk)}</strong>
                <small class="muted">${m.total_pergantian} ganti</small>
              </div>
              <div class="merk-progress-wrap">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${Math.min(100, Math.round((m.rata_rata_hari / 450) * 100))}%"></div>
                </div>
                <div class="merk-durasi">
                  <b>${m.rata_rata_hari}</b> <small>hari</small>
                </div>
              </div>
            </div>`).join('') : '<p class="muted text-sm py-2">Belum ada riwayat penggantian lampu.</p>'}
        </div>
      </div>
    </div>
  `;

  // Listener tombol WA
  const btnWa = $('#btn-quick-wa', el);
  if (btnWa) {
    btnWa.onclick = async () => {
      const teks = await DataStore.formatLaporanWA('lengkap');
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Laporan Evaluasi Lampu Pesantren',
            text: teks
          });
          return;
        } catch (e) {}
      }

      bukaModal('Salin Laporan WhatsApp', `
        <textarea id="modal-wa-text" rows="12" style="font-family:monospace;font-size:0.85rem;" readonly>${esc(teks)}</textarea>
        <div class="row-btn mt-3">
          <button class="btn success block" id="btn-open-wa-modal" type="button">📲 Buka WhatsApp</button>
          <button class="btn block" id="btn-copy-wa-action" type="button">📋 Salin Teks</button>
        </div>
      `);
      $('#btn-open-wa-modal').onclick = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(teks)}`, '_blank');
      };
      $('#btn-copy-wa-action').onclick = () => {
        navigator.clipboard.writeText(teks).then(() => {
          toast('Teks laporan berhasil disalin! Silakan tempel di WhatsApp.');
        });
      };
    };
  }
};
