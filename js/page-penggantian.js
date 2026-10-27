/* ============================================================
   Halaman Penggantian & Evaluasi Kerusakan - Mobile Friendly
   ============================================================ */

Pages.penggantian = async function (el, query) {
  const fittingList = await DataStore.getFitting();
  const jenisList = await DataStore.getJenisLampu();
  const stok = await DataStore.getStokRingkasan();
  let riwayat = await DataStore.getPenggantian();

  const tampilFormTambah = query && query.get('tambah') === '1';
  const preselectFittingId = query ? query.get('fitting_id') : null;

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h2>🔧 Penggantian & Kerusakan</h2>
        <p class="muted text-sm">Catat lampu mati, fiting hilang, atau ulah santri.</p>
      </div>
      <button class="btn primary small" id="btn-tambah-ganti" type="button">+ Catat Baru</button>
    </div>

    <div id="form-box-ganti"></div>

    <!-- Filter Mobile -->
    <div class="card toolbar-grid">
      <input type="search" id="cari-penggantian" placeholder="Cari kode, lokasi, catatan…">
      <select id="filter-alasan">
        <option value="">Semua Penyebab</option>
        <option value="dimainkan_santri">⚽ Dimainkan Santri</option>
        <option value="habis_masa_pakai">⏳ Putus Wajar (Masa Pakai)</option>
        <option value="hilang">🔍 Lampu / Fiting Hilang</option>
        <option value="konslet">⚡ Konslet / Listrik</option>
        <option value="fiting_rusak">🔌 Fiting Rusak / Kendur</option>
      </select>
      <select id="filter-santri">
        <option value="">Semua Kasus</option>
        <option value="santri">Hanya Kenakalan Santri</option>
        <option value="dini">Hanya Rusak Dini (&lt; 6 bln)</option>
      </select>
    </div>

    <!-- Daftar Riwayat Card Mobile -->
    <div id="daftar-penggantian"></div>
  `;

  const formBox = $('#form-box-ganti', el);
  const daftarEl = $('#daftar-penggantian', el);
  const btnTambah = $('#btn-tambah-ganti', el);

  function bukaForm(fittingIdAwal = null) {
    const today = new Date().toISOString().split('T')[0];
    const defaultFitting = fittingList.find(f => f.id === Number(fittingIdAwal)) || fittingList[0];

    formBox.innerHTML = `
      <form class="card form" id="f-catat-ganti">
        <h3>Catat Penggantian / Kerusakan</h3>

        <div class="grid2">
          <label class="field">
            <span>Pilih Titik Fitting *</span>
            <select name="fitting_id" id="form-sel-fitting" required>
              ${fittingList.map(f => `
                <option value="${f.id}" ${f.id === (defaultFitting?.id) ? 'selected' : ''}>
                  ${esc(f.kode)} — ${esc(labelLokasi(f.lokasi) || 'Tanpa Lokasi')} (${esc(f.status)})
                </option>`).join('')}
            </select>
          </label>

          <label class="field">
            <span>Tanggal Kejadian / Ganti *</span>
            <input type="date" name="tanggal" value="${today}" required>
          </label>

          <label class="field">
            <span>Penyebab Kerusakan *</span>
            <select name="alasan" id="form-alasan" required>
              <option value="habis_masa_pakai">⏳ Putus Wajar (Habis Masa Pakai)</option>
              <option value="dimainkan_santri">⚽ Rusak Dimainkan Santri (Pecah/Kena Benda/Bercanda)</option>
              <option value="hilang">🔍 Lampu / Fiting Hilang (Diduga diambil/dipindahkan)</option>
              <option value="konslet">⚡ Konslet / Listrik / Air Bocor</option>
              <option value="fiting_rusak">🔌 Fiting Rusak / Dudukan Kendur</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </label>

          <label class="field">
            <span>Petugas / Pemasang *</span>
            <input type="text" name="pemasang" value="${esc(App.profil?.nama || 'Ust. Pengurus')}" required>
          </label>

          <div class="field full">
            <label class="check">
              <input type="checkbox" name="indikasi_santri" id="chk-santri">
              <b class="text-danger">⚠️ Indikasi kenakalan santri di asrama</b>
            </label>
          </div>

          <label class="field full">
            <span>Catatan / Investigasi</span>
            <textarea name="catatan" rows="2" placeholder="mis. Lampu pecah terkena bantal saat santri bercanda."></textarea>
          </label>

          <label class="field">
            <span>Lampu Pengganti Baru</span>
            <select name="jenis_baru_id">
              <option value="">— Biarkan jenis yang sama —</option>
              ${stok.map(s => `
                <option value="${s.id}">
                  ${esc(s.merk)} ${esc(s.jenis)} ${s.watt ? s.watt + 'W' : ''} (Sisa: ${s.sisa} pcs)
                </option>`).join('')}
            </select>
          </label>

          <div class="field" style="padding-top:4px;">
            <label class="check">
              <input type="checkbox" name="potong_stok" checked>
              <span>Potong 1 pcs dari stok gudang</span>
            </label>
          </div>
        </div>

        <div class="row-btn mt-3">
          <button class="btn primary block" type="submit">Simpan Catatan</button>
          <button class="btn block" type="button" id="btn-batal-ganti">Batal</button>
        </div>
      </form>
    `;

    const selAlasan = $('#form-alasan', formBox);
    const chkSantri = $('#chk-santri', formBox);
    selAlasan.onchange = () => {
      if (selAlasan.value === 'dimainkan_santri' || selAlasan.value === 'hilang') {
        chkSantri.checked = true;
      }
    };

    $('#btn-batal-ganti', formBox).onclick = () => { formBox.innerHTML = ''; };

    $('#f-catat-ganti', formBox).onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = {
        fitting_id: fd.get('fitting_id'),
        tanggal: fd.get('tanggal'),
        alasan: fd.get('alasan'),
        catatan: fd.get('catatan'),
        pemasang: fd.get('pemasang'),
        jenis_baru_id: fd.get('jenis_baru_id') || undefined,
        potong_stok: fd.get('potong_stok') !== null,
        indikasi_santri: fd.get('indikasi_santri') !== null
      };

      try {
        await DataStore.catatPenggantian(payload);
        toast('Data penggantian berhasil disimpan & stok diperbarui!');
        formBox.innerHTML = '';
        riwayat = await DataStore.getPenggantian();
        gambarDaftar();
      } catch (err) {
        toast('Gagal: ' + err.message, 'err');
      }
    };

    formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  btnTambah.onclick = () => bukaForm();

  function gambarDaftar() {
    const kata = $('#cari-penggantian', el).value.trim().toLowerCase();
    const filterAlasan = $('#filter-alasan', el).value;
    const filterSantri = $('#filter-santri', el).value;

    const barisData = riwayat.filter(p => {
      const matchKata = !kata || [
        p.fitting?.kode,
        labelLokasi(p.fitting?.lokasi),
        p.catatan,
        p.pemasang,
        p.jenis_lama?.merk
      ].join(' ').toLowerCase().includes(kata);

      const matchAlasan = !filterAlasan || p.alasan === filterAlasan;

      let matchSantri = true;
      if (filterSantri === 'santri') matchSantri = Boolean(p.indikasi_santri || p.alasan === 'dimainkan_santri' || p.alasan === 'hilang');
      else if (filterSantri === 'dini') matchSantri = Boolean(p.rusak_dini);

      return matchKata && matchAlasan && matchSantri;
    });

    if (!barisData.length) {
      daftarEl.innerHTML = `<div class="card kosong-info">Tidak ada data penggantian yang cocok.</div>`;
      return;
    }

    const cardHtml = barisData.map(p => {
      let badgeAlasan = 'ok';
      if (p.alasan === 'dimainkan_santri' || p.indikasi_santri) badgeAlasan = 'danger';
      else if (p.alasan === 'hilang' || p.alasan === 'konslet') badgeAlasan = 'warn';

      return `
        <div class="mcard-item ${p.indikasi_santri ? 'danger-border' : ''}">
          <div class="mcard-head">
            <div>
              <a href="#/scan?kode=${esc(p.fitting?.kode)}" class="link-kode">${esc(p.fitting?.kode || '-')}</a>
              <small class="muted" style="margin-left:6px;">${fmtTanggal(p.tanggal)}</small>
            </div>
            <div>
              <span class="badge ${badgeAlasan}">${esc(p.alasan.replace(/_/g, ' '))}</span>
              ${p.rusak_dini ? '<span class="badge danger">Dini</span>' : ''}
            </div>
          </div>
          <div class="mcard-body">
            <b>${esc(labelLokasi(p.fitting?.lokasi) || 'Tanpa lokasi')}</b>
            ${p.catatan ? `<p style="margin:4px 0 2px;font-size:0.85rem;color:#334155;">${esc(p.catatan)}</p>` : ''}
            <small class="muted" style="display:block;">
              Lampu: ${esc(p.jenis_lama?.merk || '-')} (${p.usia_hari != null ? `${p.usia_hari} hari` : '-'}) &rarr; Ganti: ${esc(p.jenis_baru?.merk || '-')}
            </small>
          </div>
          <div class="mcard-foot">
            <small class="muted">Petugas: ${esc(p.pemasang || '-')}</small>
            <a href="#/scan?kode=${esc(p.fitting?.kode)}" class="btn small">Cek Titik</a>
          </div>
        </div>
      `;
    }).join('');

    daftarEl.innerHTML = `
      <div class="mobile-card-list">${cardHtml}</div>
      <p class="muted text-sm text-center">Menampilkan ${barisData.length} dari ${riwayat.length} riwayat</p>
    `;
  }

  $('#cari-penggantian', el).oninput = gambarDaftar;
  $('#filter-alasan', el).onchange = gambarDaftar;
  $('#filter-santri', el).onchange = gambarDaftar;

  gambarDaftar();

  if (tampilFormTambah) {
    bukaForm(preselectFittingId);
  }
};
