/* ============================================================
   Halaman Laporan Analitik, Grafik & Berbagi WhatsApp Mobile
   Mendukung: Web Share API (Langsung ke WhatsApp di HP), Chart.js
   ============================================================ */

Pages.laporan = async function (el) {
  const fitting = await DataStore.getFitting();
  const penggantian = await DataStore.getPenggantian();
  const evaluasiMerk = await DataStore.getEvaluasiMerk();
  const titikRawan = await DataStore.getEvaluasiTitikRawan();
  const stok = await DataStore.getStokRingkasan();

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h2>📈 Laporan & WhatsApp</h2>
        <p class="muted text-sm">Grafik analitik dan pengiriman laporan WhatsApp langsung dari HP.</p>
      </div>
    </div>

    <!-- Tombol Kirim WA Khusus Mobile -->
    <div class="card wa-banner">
      <div class="wa-banner-content">
        <span class="wa-icon">💬</span>
        <div>
          <b>Kirim Laporan ke WhatsApp</b>
          <p class="muted text-sm">Bagikan ke pengurus pesantren atau grup sarpras:</p>
        </div>
      </div>
      <div class="row-btn">
        <button class="btn success block" data-tipe="lengkap" type="button">📲 Kirim Laporan Evaluasi Lengkap</button>
        <button class="btn block" data-tipe="urgent" type="button">🚨 Kirim Daftar Lampu Mati</button>
        <button class="btn block" data-tipe="stok" type="button">📦 Kirim Pengajuan Belanja Stok</button>
      </div>
    </div>

    <!-- Grafik Visualisasi Interaktif (Chart.js) -->
    <div class="charts-grid mt-4">
      <div class="card chart-card">
        <h3>📊 Komposisi Penyebab Kerusakan</h3>
        <p class="muted text-sm">Perbandingan putus wajar vs dimainkan santri vs konslet:</p>
        <div class="chart-canvas-wrap">
          <canvas id="chart-penyebab"></canvas>
        </div>
      </div>

      <div class="card chart-card">
        <h3>🏆 Daya Tahan Rata-Rata per Merk</h3>
        <p class="muted text-sm">Rata-rata hari pemakaian sebelum putus:</p>
        <div class="chart-canvas-wrap">
          <canvas id="chart-merk"></canvas>
        </div>
      </div>

      <div class="card chart-card">
        <h3>🚨 Lokasi Paling Sering Rusak</h3>
        <p class="muted text-sm">Area rawan lampu mati / dimainkan santri:</p>
        <div class="chart-canvas-wrap">
          <canvas id="chart-lokasi"></canvas>
        </div>
      </div>
    </div>

    <!-- Daftar Titik Rawan (Card Mobile) -->
    <div class="card mt-4">
      <div class="card-header-flex">
        <h3>🚨 Titik Fitting Paling Rawan</h3>
      </div>
      <p class="muted text-sm">Fitting yang sering mengalami kerusakan berulang di asrama/madrasah:</p>

      <div class="mobile-card-list">
        ${titikRawan.map(r => {
          const f = r.fitting;
          let rekomendasi = 'Pemantauan berkala.';
          if (r.karena_santri >= 2) {
            rekomendasi = '⚠️ Pasang cover pelindung akrilik & beri arahan ke santri.';
          } else if (r.jumlah_rusak >= 3) {
            rekomendasi = '⚠️ Periksa sambungan kabel dan fiting dudukan.';
          }

          return `
            <div class="mcard-item ${r.karena_santri > 0 ? 'danger-border' : ''}">
              <div class="mcard-head">
                <a href="#/scan?kode=${esc(f.kode)}" class="link-kode">${esc(f.kode)}</a>
                <div>
                  <span class="badge ${r.karena_santri > 0 ? 'danger' : 'warn'}">${r.jumlah_rusak}x Rusak</span>
                  ${r.karena_santri > 0 ? `<span class="badge danger">${r.karena_santri}x Santri</span>` : ''}
                </div>
              </div>
              <div class="mcard-body">
                <b>${esc(labelLokasi(f.lokasi) || 'Lokasi belum diatur')}</b>
                <small class="muted" style="display:block;">Lampu: ${esc(labelJenis(f.jenis_lampu) || 'Belum diatur')}</small>
                <small class="text-amber" style="display:block;margin-top:2px;">${rekomendasi}</small>
              </div>
              <div class="mcard-foot">
                <span class="badge ${esc(f.status)}">${esc(f.status)}</span>
                <a href="#/penggantian?tambah=1&fitting_id=${f.id}" class="btn small primary">Ganti Lampu</a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Render Charts
  setTimeout(() => {
    const hitungAlasan = {
      habis_masa_pakai: 0,
      dimainkan_santri: 0,
      hilang: 0,
      konslet: 0,
      fiting_rusak: 0
    };
    penggantian.forEach(p => {
      if (hitungAlasan[p.alasan] !== undefined) hitungAlasan[p.alasan] += 1;
      else if (p.alasan === 'pecah' || p.indikasi_santri) hitungAlasan.dimainkan_santri += 1;
      else hitungAlasan.habis_masa_pakai += 1;
    });

    const ctxPenyebab = $('#chart-penyebab', el)?.getContext('2d');
    if (ctxPenyebab && window.Chart) {
      new Chart(ctxPenyebab, {
        type: 'doughnut',
        data: {
          labels: ['Habis Pakai', 'Ulah Santri', 'Hilang', 'Konslet', 'Fiting Rusak'],
          datasets: [{
            data: [
              hitungAlasan.habis_masa_pakai,
              hitungAlasan.dimainkan_santri,
              hitungAlasan.hilang,
              hitungAlasan.konslet,
              hitungAlasan.fiting_rusak
            ],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#6366f1', '#64748b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    const ctxMerk = $('#chart-merk', el)?.getContext('2d');
    if (ctxMerk && window.Chart) {
      new Chart(ctxMerk, {
        type: 'bar',
        data: {
          labels: evaluasiMerk.map(m => m.merk),
          datasets: [{
            label: 'Hari Nyala',
            data: evaluasiMerk.map(m => m.rata_rata_hari),
            backgroundColor: '#0f766e',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    const ctxLokasi = $('#chart-lokasi', el)?.getContext('2d');
    if (ctxLokasi && window.Chart) {
      const topLokasi = titikRawan.slice(0, 4);
      new Chart(ctxLokasi, {
        type: 'bar',
        data: {
          labels: topLokasi.map(r => r.fitting.kode),
          datasets: [
            {
              label: 'Total Kerusakan',
              data: topLokasi.map(r => r.jumlah_rusak),
              backgroundColor: '#f59e0b',
              borderRadius: 4
            },
            {
              label: 'Ulah Santri',
              data: topLokasi.map(r => r.karena_santri),
              backgroundColor: '#ef4444',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
      });
    }
  }, 100);

  // Bagikan ke WhatsApp (Web Share API Mobile)
  async function bagikanWA(tipe = 'lengkap') {
    const teks = await DataStore.formatLaporanWA(tipe);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Laporan Evaluasi Lampu Pesantren',
          text: teks
        });
        toast('Laporan siap dikirim!');
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to modal
      }
    }

    bukaModal('Laporan WhatsApp', `
      <div class="wa-modal-inner">
        <textarea id="area-wa-text" rows="12" style="font-family:monospace;font-size:0.85rem;" readonly>${esc(teks)}</textarea>
        <div class="row-btn mt-3">
          <button class="btn success block" id="btn-open-wa" type="button">📲 Buka WhatsApp Langsung</button>
          <button class="btn block" id="btn-salin-clipboard" type="button">📋 Salin ke Clipboard</button>
        </div>
      </div>
    `);

    $('#btn-open-wa').onclick = () => {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(teks)}`, '_blank');
    };

    $('#btn-salin-clipboard').onclick = () => {
      navigator.clipboard.writeText(teks).then(() => {
        toast('Teks laporan berhasil disalin! Silakan paste di WhatsApp.');
      });
    };
  }

  $$('.wa-banner button[data-tipe]', el).forEach(btn => {
    btn.onclick = () => bagikanWA(btn.dataset.tipe);
  });
};
