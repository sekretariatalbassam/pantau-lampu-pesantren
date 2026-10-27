/* ============================================================
   Halaman Stok Gudang - Mobile Friendly
   ============================================================ */

Pages.stok = async function (el) {
  let ringkasan = await DataStore.getStokRingkasan();
  let mutasi = await DataStore.getMutasiStok();
  const jenisList = await DataStore.getJenisLampu();

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h2>📦 Stok Lampu Gudang</h2>
        <p class="muted text-sm">Kelola persediaan lampu masuk dan mutasi keluar.</p>
      </div>
      <div class="row-btn">
        <button class="btn primary small" id="btn-tambah-masuk" type="button">+ Stok Masuk</button>
        <button class="btn small" id="btn-tambah-keluar" type="button">- Stok Keluar</button>
      </div>
    </div>

    <div id="form-box-stok"></div>

    <!-- Kartu Status Stok Per Jenis (2 Kolom di HP) -->
    <div class="stok-cards-grid" id="stok-cards"></div>

    <!-- Riwayat Mutasi Stok Mobile -->
    <div class="card mt-4">
      <div class="card-header-flex">
        <h3>📜 Riwayat Keluar-Masuk</h3>
        <input type="search" id="cari-stok" placeholder="Cari merk, keterangan…">
      </div>
      <div id="daftar-mutasi"></div>
    </div>
  `;

  const formBox = $('#form-box-stok', el);
  const cardsContainer = $('#stok-cards', el);
  const mutasiContainer = $('#daftar-mutasi', el);

  function gambarKartuStok() {
    cardsContainer.innerHTML = ringkasan.map(s => {
      let badgeClass = s.status_stok === 'habis' ? 'danger' : s.status_stok === 'menipis' ? 'warn' : 'ok';
      let statusText = s.status_stok === 'habis' ? 'HABIS' : s.status_stok === 'menipis' ? 'MENIPIS' : 'AMAN';

      return `
        <div class="stok-card ${s.status_stok !== 'aman' ? 'border-warning' : ''}">
          <div class="stok-card-top">
            <span class="badge ${badgeClass}">${statusText}</span>
            <small class="muted">${s.watt ? s.watt + 'W' : ''}</small>
          </div>
          <h3 class="stok-merk">${esc(s.merk)}</h3>
          <div class="stok-number-wrap">
            <span class="stok-number ${s.status_stok === 'habis' ? 'text-danger' : s.status_stok === 'menipis' ? 'text-warn' : 'text-primary'}">${s.sisa}</span>
            <span class="stok-unit">pcs sisa</span>
          </div>
          <div class="stok-bar-meta">
            <span>In: <b>${s.total_masuk}</b></span>
            <span>Out: <b>${s.total_keluar}</b></span>
          </div>
        </div>
      `;
    }).join('');
  }

  function gambarMutasi() {
    const kata = ($('#cari-stok', el).value || '').trim().toLowerCase();
    const dataTampil = mutasi.filter(m =>
      !kata || [m.jenis_lampu?.merk, m.jenis_lampu?.jenis, m.keterangan, m.dibuat_oleh].join(' ').toLowerCase().includes(kata)
    );

    if (!dataTampil.length) {
      mutasiContainer.innerHTML = `<div class="kosong-info">Tidak ada catatan mutasi stok.</div>`;
      return;
    }

    const cardHtml = dataTampil.map(m => `
      <div class="mcard-item">
        <div class="mcard-head">
          <span class="badge ${m.arah === 'masuk' ? 'ok' : 'danger'}">
            ${m.arah === 'masuk' ? '+ MASUK' : '- KELUAR'}
          </span>
          <b style="font-size:1.1rem;color:${m.arah === 'masuk' ? 'var(--ok)' : 'var(--danger)'};">
            ${m.arah === 'masuk' ? '+' : '-'}${m.jumlah} pcs
          </b>
        </div>
        <div class="mcard-body">
          <b>${esc(labelJenis(m.jenis_lampu) || 'Jenis tidak dikenal')}</b>
          <p style="margin:2px 0 0;font-size:0.85rem;color:#334155;">${esc(m.keterangan || '-')}</p>
        </div>
        <div class="mcard-foot">
          <small class="muted">${fmtTanggal(m.tanggal)}</small>
          <small class="muted">Oleh: ${esc(m.dibuat_oleh || '-')}</small>
        </div>
      </div>
    `).join('');

    mutasiContainer.innerHTML = `<div class="mobile-card-list">${cardHtml}</div>`;
  }

  function bukaFormMutasi(arah = 'masuk') {
    const today = new Date().toISOString().split('T')[0];

    formBox.innerHTML = `
      <form class="card form" id="f-mutasi-stok">
        <h3>${arah === 'masuk' ? '+ Catat Stok Masuk (Beli/Donasi)' : '- Catat Stok Keluar'}</h3>
        <div class="grid2">
          <label class="field">
            <span>Pilih Jenis Lampu *</span>
            <select name="jenis_lampu_id" required>
              ${jenisList.map(j => `
                <option value="${j.id}">${esc(j.merk)} ${esc(j.jenis)} ${j.watt ? j.watt + 'W' : ''}</option>
              `).join('')}
            </select>
          </label>

          <label class="field">
            <span>Jumlah (pcs) *</span>
            <input type="number" name="jumlah" min="1" value="10" required>
          </label>

          <label class="field">
            <span>Tanggal *</span>
            <input type="date" name="tanggal" value="${today}" required>
          </label>

          <label class="field">
            <span>Nama Petugas *</span>
            <input type="text" name="dibuat_oleh" value="${esc(App.profil?.nama || 'Petugas')}" required>
          </label>

          <label class="field full">
            <span>Keterangan / Keperluan *</span>
            <input type="text" name="keterangan" placeholder="${arah === 'masuk' ? 'mis. Beli di Toko Listrik / Donatur' : 'mis. Acara pesantren / cadangan'}" required>
          </label>
        </div>

        <div class="row-btn mt-3">
          <button class="btn primary block" type="submit">Simpan Stok ${arah === 'masuk' ? 'Masuk' : 'Keluar'}</button>
          <button class="btn block" type="button" id="btn-batal-stok">Batal</button>
        </div>
      </form>
    `;

    $('#btn-batal-stok', formBox).onclick = () => { formBox.innerHTML = ''; };

    $('#f-mutasi-stok', formBox).onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = {
        jenis_lampu_id: fd.get('jenis_lampu_id'),
        arah: arah,
        jumlah: fd.get('jumlah'),
        tanggal: fd.get('tanggal'),
        keterangan: fd.get('keterangan'),
        dibuat_oleh: fd.get('dibuat_oleh')
      };

      try {
        await DataStore.catatMutasiStok(payload);
        toast(`Stok ${arah === 'masuk' ? 'masuk' : 'keluar'} berhasil disimpan!`);
        formBox.innerHTML = '';
        ringkasan = await DataStore.getStokRingkasan();
        mutasi = await DataStore.getMutasiStok();
        gambarKartuStok();
        gambarMutasi();
      } catch (err) {
        toast('Gagal: ' + err.message, 'err');
      }
    };

    formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  $('#btn-tambah-masuk', el).onclick = () => bukaFormMutasi('masuk');
  $('#btn-tambah-keluar', el).onclick = () => bukaFormMutasi('keluar');
  $('#cari-stok', el).oninput = gambarMutasi;

  gambarKartuStok();
  gambarMutasi();
};
