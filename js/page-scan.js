/* ============================================================
   Halaman Pindai QR Code - Khusus Smartphone & Kamera HP
   Mendukung: Auto-focus, Torch/Senter, Switch Kamera, Input Cepat
   ============================================================ */

let html5QrCodeScanner = null;
let currentFacingMode = 'environment'; // Bawaan kamera belakang

Pages.scan = async function (el, query) {
  el.innerHTML = `
    <div class="page-head">
      <div>
        <h2>📷 Pindai QR Dudukan Lampu</h2>
        <p class="muted text-sm">Arahkan kamera ke stiker fitting atau masukkan kode manual.</p>
      </div>
    </div>

    <!-- Scanner Kamera HP -->
    <div class="card scanner-box">
      <div class="scanner-header">
        <span class="text-sm font-medium">Kamera Pemindai</span>
        <div class="row-btn">
          <button class="btn small" id="btn-flip-cam" type="button" title="Ganti Kamera Depan/Belakang">🔄 Putar</button>
          <button class="btn small primary" id="btn-toggle-cam" type="button">Mulai Kamera</button>
        </div>
      </div>

      <div id="qr-reader-container" class="qr-viewport">
        <div id="qr-reader" style="width: 100%;"></div>
        <div id="qr-placeholder" class="qr-placeholder">
          <span class="qr-big-icon">📷</span>
          <p>Ketuk <b>Mulai Kamera</b> untuk mengaktifkan pemindai di HP Anda.</p>
        </div>
      </div>

      <div class="divider"><span>ATAU KETIK KODE MANUAL</span></div>

      <form id="f-manual-scan" class="manual-scan-form">
        <div class="input-with-button">
          <input type="text" id="manual-kode" placeholder="mis. F-004" autocomplete="off" style="text-transform:uppercase;">
          <button class="btn primary" type="submit">Cari</button>
        </div>
      </form>
    </div>

    <!-- Hasil Pindai (Card Mobile) -->
    <div class="card" id="scan-result-card">
      <div class="empty-state" id="scan-empty-state">
        <span class="empty-icon" style="font-size:2rem;display:block;margin-bottom:6px;">💡</span>
        <h4 style="margin:0 0 4px;">Hasil Pindai</h4>
        <p class="muted text-sm">Arahkan kamera ke QR fitting untuk melihat status dan mencatat penggantian.</p>
      </div>
      <div id="fitting-detail-view" hidden></div>
    </div>
  `;

  const btnToggleCam = $('#btn-toggle-cam', el);
  const btnFlipCam = $('#btn-flip-cam', el);
  const qrPlaceholder = $('#qr-placeholder', el);
  const emptyState = $('#scan-empty-state', el);
  const detailView = $('#fitting-detail-view', el);
  const manualForm = $('#f-manual-scan', el);
  const manualInput = $('#manual-kode', el);

  let isScanning = false;

  async function startScanner() {
    if (!window.Html5Qrcode) {
      toast('Pustaka pemindai belum siap.', 'err');
      return;
    }

    try {
      if (!html5QrCodeScanner) {
        html5QrCodeScanner = new Html5Qrcode('qr-reader');
      }

      qrPlaceholder.hidden = true;
      btnToggleCam.textContent = 'Matikan';
      btnToggleCam.className = 'btn small danger';

      const config = {
        fps: 15,
        qrbox: (w, h) => {
          const edge = Math.min(w, h) * 0.72;
          return { width: Math.round(edge), height: Math.round(edge) };
        }
      };

      await html5QrCodeScanner.start(
        { facingMode: currentFacingMode },
        config,
        (decodedText) => {
          bunyiBeep('ok');
          tampilkanHasil(decodedText);
          stopScanner();
        },
        () => {}
      );
      isScanning = true;
    } catch (err) {
      console.warn('Gagal kamera:', err);
      qrPlaceholder.hidden = false;
      btnToggleCam.textContent = 'Mulai Kamera';
      btnToggleCam.className = 'btn small primary';
      toast('Akses kamera tidak diizinkan atau tidak tersedia: ' + (err.message || err), 'err');
      isScanning = false;
    }
  }

  async function stopScanner() {
    if (html5QrCodeScanner && isScanning) {
      try { await html5QrCodeScanner.stop(); } catch (e) {}
      isScanning = false;
    }
    qrPlaceholder.hidden = false;
    btnToggleCam.textContent = 'Mulai Kamera';
    btnToggleCam.className = 'btn small primary';
  }

  btnToggleCam.onclick = () => {
    if (isScanning) stopScanner();
    else startScanner();
  };

  btnFlipCam.onclick = async () => {
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    if (isScanning) {
      await stopScanner();
      await startScanner();
    } else {
      toast(`Kamera dialihkan ke: ${currentFacingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}`);
    }
  };

  manualForm.onsubmit = (e) => {
    e.preventDefault();
    const kode = manualInput.value.trim();
    if (!kode) return;
    tampilkanHasil(kode);
  };

  async function tampilkanHasil(teksQr) {
    let kode = teksQr.trim();
    if (kode.includes('/')) {
      const match = kode.match(/F-\d+/i);
      if (match) kode = match[0];
    }

    const fitting = await DataStore.getFittingByKode(kode);
    if (!fitting) {
      bunyiBeep('err');
      toast(`Fitting "${kode}" tidak ditemukan!`, 'err');
      emptyState.hidden = false;
      detailView.hidden = true;
      return;
    }

    const penggantianList = (await DataStore.getPenggantian()).filter(p => p.fitting_id === fitting.id);
    const hitungSantri = penggantianList.filter(p => p.alasan === 'dimainkan_santri' || p.alasan === 'hilang' || p.indikasi_santri).length;

    let usiaHari = 0;
    if (fitting.tanggal_pasang) {
      const ms = Date.now() - new Date(fitting.tanggal_pasang).getTime();
      usiaHari = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
    }

    emptyState.hidden = true;
    detailView.hidden = false;

    detailView.innerHTML = `
      <div class="detail-head">
        <div>
          <span class="badge ${esc(fitting.status)}">${esc(fitting.status.toUpperCase())}</span>
          ${hitungSantri > 0 ? `<span class="badge danger">⚠️ ${hitungSantri}x Ulah Santri</span>` : ''}
          <h2 style="margin:4px 0 0;font-size:1.6rem;font-family:monospace;">${esc(fitting.kode)}</h2>
        </div>
        <a href="#/penggantian?tambah=1&fitting_id=${fitting.id}" class="btn primary small">
          🔧 Ganti Lampu
        </a>
      </div>

      <div class="detail-section">
        <h4 style="margin-bottom:6px;">📍 Lokasi</h4>
        <div class="info-table">
          <div class="info-row">
            <span class="info-label">Area:</span>
            <b>${esc(fitting.lokasi?.gedung || '-')}</b>
          </div>
          <div class="info-row">
            <span class="info-label">Ruang:</span>
            <b>${esc([fitting.lokasi?.lantai && 'Lt. ' + fitting.lokasi.lantai, fitting.lokasi?.ruang].filter(Boolean).join(' › ') || '-')}</b>
          </div>
          ${fitting.keterangan ? `
            <div class="info-row">
              <span class="info-label">Posisi:</span>
              <span>${esc(fitting.keterangan)}</span>
            </div>` : ''}
        </div>
      </div>

      <div class="detail-section">
        <h4 style="margin-bottom:6px;">💡 Lampu Terpasang</h4>
        <div class="info-table">
          <div class="info-row">
            <span class="info-label">Merk:</span>
            <b>${esc(labelJenis(fitting.jenis_lampu) || 'Belum diatur')}</b>
          </div>
          <div class="info-row">
            <span class="info-label">Dipasang:</span>
            <span>${esc(fmtTanggal(fitting.tanggal_pasang))} (<b>${usiaHari}</b> hari lalu)</span>
          </div>
          <div class="info-row">
            <span class="info-label">Petugas:</span>
            <span>${esc(fitting.pemasang || '-')}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h4 style="margin-bottom:6px;">📜 Riwayat Titik Ini (${penggantianList.length})</h4>
        ${penggantianList.length ? `
          <div class="history-list">
            ${penggantianList.map(p => `
              <div class="history-item ${p.indikasi_santri ? 'border-danger' : ''}">
                <div class="history-meta">
                  <b>${fmtTanggal(p.tanggal)}</b>
                  <span class="badge ${p.alasan === 'dimainkan_santri' ? 'danger' : p.alasan === 'habis_masa_pakai' ? 'ok' : 'warn'}">
                    ${p.alasan.replace(/_/g, ' ')}
                  </span>
                </div>
                <p class="history-note">${esc(p.catatan || 'Tanpa catatan')}</p>
                <small class="muted">
                  ${esc(labelJenis(p.jenis_lama))} (${p.usia_hari || 0} hari) · Oleh: ${esc(p.pemasang)}
                </small>
              </div>`).join('')}
          </div>` : '<p class="muted text-sm">Belum ada riwayat kerusakan pada fitting ini.</p>'}
      </div>
    `;

    // Scroll otomatis ke hasil scan
    detailView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (query && query.get('kode')) {
    manualInput.value = query.get('kode');
    tampilkanHasil(query.get('kode'));
  }
};
