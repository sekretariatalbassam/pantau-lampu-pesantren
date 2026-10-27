/* ============================================================
   Halaman Cetak Label Fitting A4 (Preset 12 Label / Lembar)
   Format: 3 Kolom x 4 Baris (Ukuran pas stiker A4 isi 12)
   ============================================================ */

function qrSvg(teks) {
  const qr = qrcode(0, 'M');
  qr.addData(teks);
  qr.make();
  return qr.createSvgTag({ cellSize: 2, margin: 0, scalable: true });
}

Pages.label = async function (el) {
  const fitting = await DataStore.getFitting();

  if (!fitting.length) {
    el.innerHTML = `
      <div class="page-head"><h2>🏷️ Cetak Label Fitting (A4 - 12 Label)</h2></div>
      <div class="card kosong-info">Belum ada data fitting. Silakan tambahkan fitting terlebih dahulu.</div>
    `;
    return;
  }

  const nomorMin = nomorKode(fitting[0].kode);
  const nomorMaks = nomorKode(fitting[fitting.length - 1].kode);

  el.innerHTML = `
    <div class="no-print">
      <div class="page-head">
        <div>
          <h2>🏷️ Cetak Label Fitting A4 (12 Label / Lembar)</h2>
          <p class="muted">Desain khusus stiker A4 isi 12 label (3 kolom &times; 4 baris) dengan QR code siap scan.</p>
        </div>
        <div class="row-btn">
          <button class="btn primary" id="btn-cetak-langsung" type="button">🖨️ Cetak Sekarang (Print / PDF)</button>
        </div>
      </div>

      <form id="f-label-pengaturan" class="card form">
        <h3>Pengaturan Cetak</h3>
        <div class="grid2">
          <label class="field">
            <span>Dari Nomor Fitting</span>
            <input type="number" name="dari" min="1" value="${nomorMin}" required>
            <small>Nomor terkecil: ${esc(fitting[0].kode)}</small>
          </label>

          <label class="field">
            <span>Sampai Nomor Fitting</span>
            <input type="number" name="sampai" min="1" value="${nomorMaks}" required>
            <small>Nomor terbesar: ${esc(fitting[fitting.length - 1].kode)}</small>
          </label>

          <label class="field">
            <span>Mulai di Kotak Ke- (1 s/d 12)</span>
            <input type="number" name="mulai" min="1" max="12" value="1" required>
            <small>Gunakan ini bila kertas stiker sebelumnya sudah terpakai sebagian</small>
          </label>

          <label class="field">
            <span>Pilihan Template</span>
            <select name="template">
              <option value="12" selected>Standar A4 — 12 Label (3x4) Pas Stiker</option>
              <option value="20">Kecil A4 — 20 Label (4x5)</option>
            </select>
          </label>
        </div>

        <div class="row-btn mt-2">
          <label class="check">
            <input type="checkbox" name="garis" checked>
            <span>Tampilkan garis putus-putus panduan potong</span>
          </label>
          <label class="check">
            <input type="checkbox" name="peringatan" checked>
            <span>Sertakan teks peringatan santri ("Dilarang dilepas/ditukar")</span>
          </label>
        </div>

        <div class="row-btn mt-3">
          <button class="btn" type="submit">Perbarui Pratinjau Lembar</button>
        </div>
      </form>

      <div class="alert-box info">
        <div class="alert-icon">💡</div>
        <div class="alert-content">
          <strong>Petunjuk Cetak:</strong>
          Saat jendela cetak browser muncul, pilih Ukuran Kertas <b>A4</b>, Margin: <b>None / Tidak ada</b>, dan Skala: <b>100% (Default)</b> agar presisi 12 stiker per lembar.
        </div>
      </div>
    </div>

    <!-- Area Pratinjau Kertas A4 yang Dicetak -->
    <div class="lembar-wrap" id="lembar-cetak"></div>
  `;

  const form = $('#f-label-pengaturan', el);
  const lembarWrap = $('#lembar-cetak', el);
  const btnCetak = $('#btn-cetak-langsung', el);

  function renderPratinjau() {
    const fd = new FormData(form);
    let dari = Number(fd.get('dari')) || 1;
    let sampai = Number(fd.get('sampai')) || 12;
    if (sampai < dari) [dari, sampai] = [sampai, dari];

    const mulai = Math.max(1, Math.min(12, Number(fd.get('mulai')) || 1));
    const garis = fd.get('garis') !== null;
    const peringatan = fd.get('peringatan') !== null;

    // Filter fitting dalam rentang
    const dipilih = fitting.filter(f => {
      const n = nomorKode(f.kode);
      return n >= dari && n <= sampai;
    });

    if (!dipilih.length) {
      lembarWrap.innerHTML = `<div class="card kosong-info">Tidak ada fitting dalam rentang F-${String(dari).padStart(3, '0')} s/d F-${String(sampai).padStart(3, '0')}.</div>`;
      return;
    }

    // Grid 12: 3 kolom x 4 baris
    const perLembar = 12;
    const kotak = [...Array(mulai - 1).fill(null), ...dipilih];
    const totalLembar = Math.ceil(kotak.length / perLembar);

    let htmlLembar = '';
    for (let h = 0; h < totalLembar; h++) {
      const items = kotak.slice(h * perLembar, (h + 1) * perLembar);
      
      const labelItems = items.map(f => {
        if (!f) return `<div class="lbl-12 kosong"></div>`;

        const lokasiStr = labelLokasi(f.lokasi) || 'Lokasi belum diatur';
        const lampuStr = labelJenis(f.jenis_lampu) || 'Lampu belum diatur';

        return `
          <div class="lbl-12 ${garis ? 'garis-potong' : ''}">
            <div class="lbl-top">
              <span class="lbl-instansi">${esc(CONFIG.NAMA_LEMBAGA)}</span>
              <span class="lbl-sub">SARPRAS PENERANGAN</span>
            </div>
            
            <div class="lbl-body">
              <div class="lbl-qr-box">
                ${qrSvg(f.kode)}
              </div>
              <div class="lbl-main-info">
                <span class="lbl-kode-besar">${esc(f.kode)}</span>
                <span class="lbl-lokasi-text">${esc(lokasiStr)}</span>
                <span class="lbl-lampu-text">${esc(lampuStr)}</span>
              </div>
            </div>

            <div class="lbl-bottom">
              ${peringatan ? `<span class="lbl-warning-text">⚠️ JANGAN DILEPAS / DITUKAR TANPA IZIN</span>` : `<span>Tgl Pasang: ${fmtTanggal(f.tanggal_pasang)}</span>`}
            </div>
          </div>
        `;
      }).join('');

      htmlLembar += `
        <section class="sheet-a4-12">
          <div class="grid-12-a4">
            ${labelItems}
          </div>
        </section>
      `;
    }

    lembarWrap.innerHTML = htmlLembar;
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    renderPratinjau();
  };

  btnCetak.onclick = () => {
    window.print();
  };

  renderPratinjau();
};
