/* ============================================================
   Halaman Titik Fitting - Mobile First Responsive List & Action
   ============================================================ */

Pages.fitting = async function (el) {
  const lokasi = await DataStore.getLokasi();
  const jenis = await DataStore.getJenisLampu();
  let semua = await DataStore.getFitting();

  let tampil = [];
  const terpilih = new Set();

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h2>💡 Titik Dudukan Lampu</h2>
        <p class="muted text-sm">Daftar fitting dan lampu terpasang di pesantren.</p>
      </div>
      <div class="row-btn" style="flex-wrap:wrap;">
        <button class="btn primary small" id="btn-tambah-fitting" type="button">+ Tambah</button>
        <button class="btn small" id="btn-tambah-banyak" type="button">+ Buat Banyak</button>
        <button class="btn small" id="btn-import-fitting" type="button">📥 Import</button>
        <button class="btn small" id="btn-export-fitting" type="button">📤 Export</button>
      </div>
    </div>

    <div id="form-box-fitting"></div>

    <div class="card toolbar-grid">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input type="search" id="cari-fitting" placeholder="Cari kode (F-001), lokasi, merk…" inputmode="search">
      </div>

      <!-- Chips Filter Status (Flick jempol ke samping di HP) -->
      <div class="chips-scroll-wrap" id="chips-status-fitting">
        <button type="button" class="chip active" data-val="">Semua Status</button>
        <button type="button" class="chip" data-val="aktif">💡 Menyala</button>
        <button type="button" class="chip danger" data-val="kosong">⚠️ Mati / Kosong</button>
        <button type="button" class="chip" data-val="nonaktif">Nonaktif</button>
      </div>

      <!-- Chips Filter Gedung -->
      <div class="chips-scroll-wrap" id="chips-gedung-fitting">
        <button type="button" class="chip active" data-val="">Semua Gedung</button>
        ${[...new Set(lokasi.map(l => l.gedung))].map(g => `<button type="button" class="chip" data-val="${esc(g)}">🏛️ ${esc(g)}</button>`).join('')}
      </div>
    </div>

    <div id="bar-massal" class="card bar-massal" hidden></div>
    <div id="daftar-fitting"></div>
  `;

  const formBox = $('#form-box-fitting', el);
  const daftar = $('#daftar-fitting', el);
  const cariInput = $('#cari-fitting', el);

  let filterStatus = '';
  let filterGedung = '';

  $$('#chips-status-fitting .chip', el).forEach(btn => {
    btn.onclick = () => {
      $$('#chips-status-fitting .chip', el).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterStatus = btn.dataset.val;
      gambarDaftar();
    };
  });

  $$('#chips-gedung-fitting .chip', el).forEach(btn => {
    btn.onclick = () => {
      $$('#chips-gedung-fitting .chip', el).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterGedung = btn.dataset.val;
      gambarDaftar();
    };
  });

  function gambarDaftar() {
    const kata = cariInput.value.trim().toLowerCase();
    const status = filterStatus;
    const gedung = filterGedung;

    tampil = semua.filter(f => {
      const matchKata = !kata || [
        f.kode,
        labelLokasi(f.lokasi),
        labelJenis(f.jenis_lampu),
        f.pemasang,
        f.keterangan
      ].join(' ').toLowerCase().includes(kata);

      const matchStatus = !status || f.status === status;
      const matchGedung = !gedung || f.lokasi?.gedung === gedung;

      return matchKata && matchStatus && matchGedung;
    });

    if (!semua.length) {
      daftar.innerHTML = `<div class="card kosong-info">Belum ada fitting. Tekan <b>+ Tambah</b> untuk membuat titik fitting.</div>`;
    } else if (!tampil.length) {
      daftar.innerHTML = `<div class="card kosong-info">Tidak ada fitting yang cocok dengan filter pencarian.</div>`;
    } else {
      // Tampilan Card List yang sangat ramah jari di layar HP
      const cardItems = tampil.map(f => {
        let usiaHari = '-';
        if (f.tanggal_pasang) {
          const ms = Date.now() - new Date(f.tanggal_pasang).getTime();
          usiaHari = `${Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))} hari`;
        }

        return `
          <div class="mcard-item">
            <div class="mcard-head">
              <div style="display:flex;align-items:center;gap:8px;">
                <input type="checkbox" class="pilih-item" data-id="${f.id}" ${terpilih.has(f.id) ? 'checked' : ''} style="width:18px;height:18px;">
                <a href="#/scan?kode=${esc(f.kode)}" class="link-kode">${esc(f.kode)}</a>
              </div>
              <span class="badge ${esc(f.status)}">${esc(f.status)}</span>
            </div>
            <div class="mcard-body">
              <b>${esc(labelLokasi(f.lokasi)) || '<span class="muted">Belum ada lokasi</span>'}</b>
              ${f.keterangan ? `<small class="muted" style="display:block;">${esc(f.keterangan)}</small>` : ''}
              <div style="margin-top:4px;">
                <span class="text-sm">💡 ${esc(labelJenis(f.jenis_lampu)) || '<span class="muted">Belum ada lampu</span>'}</span>
                <small class="muted" style="display:block;">Pasang: ${fmtTanggal(f.tanggal_pasang)} (${usiaHari})</small>
              </div>
            </div>
            <div class="mcard-foot">
              <a href="#/scan?kode=${esc(f.kode)}" class="btn small">📷 QR Detail</a>
              <div class="row-btn">
                <a href="#/penggantian?tambah=1&fitting_id=${f.id}" class="btn small primary">Ganti</a>
                <button class="btn small" data-ubah="${f.id}" type="button">Ubah</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      daftar.innerHTML = `
        <div class="mobile-card-list">${cardItems}</div>
        <p class="muted text-sm text-center">Menampilkan ${tampil.length} dari ${semua.length} fitting</p>
      `;
    }
    gambarBarMassal();
  }

  function gambarBarMassal() {
    const bar = $('#bar-massal', el);
    bar.hidden = terpilih.size === 0;
    if (!terpilih.size) return;

    bar.innerHTML = `
      <span><b>${terpilih.size}</b> fitting dipilih</span>
      <div class="row-btn">
        <button class="btn primary small" id="btn-atur-massal" type="button">Atur Sekaligus</button>
        <button class="btn small" id="btn-lepas-pilihan" type="button">Batal</button>
      </div>
    `;

    $('#btn-atur-massal', bar).onclick = bukaFormMassal;
    $('#btn-lepas-pilihan', bar).onclick = () => { terpilih.clear(); gambarDaftar(); };
  }

  function bukaFormSingle(fitting = null) {
    const isEdit = Boolean(fitting);
    formBox.innerHTML = `
      <form class="card form" id="f-single-fitting">
        <h3>${isEdit ? `Ubah Fitting ${esc(fitting.kode)}` : 'Tambah Fitting Baru'}</h3>
        <div class="grid2">
          <label class="field">
            <span>Kode Fitting *</span>
            <input type="text" name="kode" value="${isEdit ? esc(fitting.kode) : kodeDariNomor(semua.length + 1)}" required style="text-transform:uppercase;">
          </label>

          <label class="field">
            <span>Lokasi Pemasangan</span>
            <select name="lokasi_id">
              <option value="">— Belum diatur —</option>
              ${lokasi.map(l => `<option value="${l.id}" ${fitting?.lokasi_id === l.id ? 'selected' : ''}>${esc(labelLokasi(l))}</option>`).join('')}
            </select>
          </label>

          <label class="field">
            <span>Jenis Lampu</span>
            <select name="jenis_lampu_id">
              <option value="">— Belum ada lampu —</option>
              ${jenis.map(j => `<option value="${j.id}" ${fitting?.jenis_lampu_id === j.id ? 'selected' : ''}>${esc(labelJenis(j))}</option>`).join('')}
            </select>
          </label>

          <label class="field">
            <span>Status</span>
            <select name="status">
              <option value="aktif" ${fitting?.status === 'aktif' ? 'selected' : ''}>Aktif</option>
              <option value="kosong" ${fitting?.status === 'kosong' ? 'selected' : ''}>Kosong (Mati)</option>
              <option value="nonaktif" ${fitting?.status === 'nonaktif' ? 'selected' : ''}>Nonaktif</option>
            </select>
          </label>

          <label class="field">
            <span>Tanggal Pasang</span>
            <input type="date" name="tanggal_pasang" value="${fitting?.tanggal_pasang || new Date().toISOString().split('T')[0]}">
          </label>

          <label class="field">
            <span>Nama Pemasang</span>
            <input type="text" name="pemasang" value="${esc(fitting?.pemasang || App.profil?.nama || '')}">
          </label>

          <label class="field full">
            <span>Keterangan</span>
            <input type="text" name="keterangan" value="${esc(fitting?.keterangan || '')}" placeholder="mis. Di atas pintu masuk">
          </label>
        </div>

        <div class="row-btn mt-3">
          <button class="btn primary block" type="submit">Simpan Fitting</button>
          <button class="btn block" type="button" id="btn-batal-single">Batal</button>
        </div>
      </form>
    `;

    $('#btn-batal-single', formBox).onclick = () => { formBox.innerHTML = ''; };

    $('#f-single-fitting', formBox).onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const dataItem = {
        kode: fd.get('kode').trim().toUpperCase(),
        lokasi_id: fd.get('lokasi_id') ? Number(fd.get('lokasi_id')) : null,
        jenis_lampu_id: fd.get('jenis_lampu_id') ? Number(fd.get('jenis_lampu_id')) : null,
        status: fd.get('status'),
        tanggal_pasang: fd.get('tanggal_pasang') || null,
        pemasang: fd.get('pemasang') || null,
        keterangan: fd.get('keterangan') || null
      };

      if (isEdit) {
        const idx = DataStore.memory.fitting.findIndex(f => f.id === fitting.id);
        if (idx >= 0) {
          DataStore.memory.fitting[idx] = { ...DataStore.memory.fitting[idx], ...dataItem };
        }
      } else {
        dataItem.id = Date.now();
        DataStore.memory.fitting.push(dataItem);
      }

      DataStore.persist();
      toast('Fitting berhasil disimpan!');
      formBox.innerHTML = '';
      semua = await DataStore.getFitting();
      gambarDaftar();
    };

    formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function bukaFormMassal() {
    formBox.innerHTML = `
      <form class="card form" id="f-massal-fitting">
        <h3>Atur ${terpilih.size} Fitting Sekaligus</h3>
        <div class="grid2">
          <label class="field">
            <span>Ganti Lokasi</span>
            <select name="lokasi_id">
              <option value="">— Jangan ubah lokasi —</option>
              ${lokasi.map(l => `<option value="${l.id}">${esc(labelLokasi(l))}</option>`).join('')}
            </select>
          </label>

          <label class="field">
            <span>Ganti Jenis Lampu</span>
            <select name="jenis_lampu_id">
              <option value="">— Jangan ubah lampu —</option>
              ${jenis.map(j => `<option value="${j.id}">${esc(labelJenis(j))}</option>`).join('')}
            </select>
          </label>

          <label class="field">
            <span>Ganti Status</span>
            <select name="status">
              <option value="">— Jangan ubah status —</option>
              <option value="aktif">Aktif</option>
              <option value="kosong">Kosong</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </label>
        </div>

        <div class="row-btn mt-3">
          <button class="btn primary block" type="submit">Terapkan Perubahan</button>
          <button class="btn block" type="button" id="btn-batal-massal">Batal</button>
        </div>
      </form>
    `;

    $('#btn-batal-massal', formBox).onclick = () => { formBox.innerHTML = ''; };

    $('#f-massal-fitting', formBox).onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const lokId = fd.get('lokasi_id');
      const jnsId = fd.get('jenis_lampu_id');
      const stat = fd.get('status');

      DataStore.memory.fitting.forEach(f => {
        if (terpilih.has(f.id)) {
          if (lokId) f.lokasi_id = Number(lokId);
          if (jnsId) f.jenis_lampu_id = Number(jnsId);
          if (stat) f.status = stat;
        }
      });

      DataStore.persist();
      toast(`Berhasil memperbarui ${terpilih.size} fitting!`);
      terpilih.clear();
      formBox.innerHTML = '';
      semua = await DataStore.getFitting();
      gambarDaftar();
    };
  }

  function bukaFormBuatBanyak() {
    formBox.innerHTML = `
      <form class="card form" id="f-banyak-fitting">
        <h3>+ Buat Nomor Fitting Sekaligus</h3>
        <div class="grid2">
          <label class="field">
            <span>Dari Nomor</span>
            <input type="number" name="dari" min="1" value="${semua.length + 1}" required>
          </label>
          <label class="field">
            <span>Sampai Nomor</span>
            <input type="number" name="sampai" min="1" value="${semua.length + 10}" required>
          </label>
        </div>

        <div class="row-btn mt-3">
          <button class="btn primary block" type="submit">Buat Fitting</button>
          <button class="btn block" type="button" id="btn-batal-banyak">Batal</button>
        </div>
      </form>
    `;

    $('#btn-batal-banyak', formBox).onclick = () => { formBox.innerHTML = ''; };

    $('#f-banyak-fitting', formBox).onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      let dari = Number(fd.get('dari'));
      let sampai = Number(fd.get('sampai'));
      if (sampai < dari) [dari, sampai] = [sampai, dari];

      let ditambah = 0;
      const adaKode = new Set(DataStore.memory.fitting.map(f => f.kode));

      for (let n = dari; n <= sampai; n++) {
        const kode = kodeDariNomor(n);
        if (!adaKode.has(kode)) {
          DataStore.memory.fitting.push({
            id: Date.now() + n,
            kode: kode,
            lokasi_id: null,
            jenis_lampu_id: null,
            status: 'kosong',
            tanggal_pasang: null,
            pemasang: null,
            keterangan: null
          });
          ditambah++;
        }
      }

      DataStore.persist();
      toast(`Berhasil membuat ${ditambah} fitting baru!`);
      formBox.innerHTML = '';
      semua = await DataStore.getFitting();
      gambarDaftar();
    };
  }

  daftar.onclick = (e) => {
    const target = e.target;
    if (target.classList.contains('pilih-item')) {
      const id = Number(target.dataset.id);
      if (target.checked) terpilih.add(id);
      else terpilih.delete(id);
      gambarBarMassal();
      return;
    }

    const btnUbah = target.closest('[data-ubah]');
    if (btnUbah) {
      const id = Number(btnUbah.dataset.ubah);
      const f = semua.find(item => item.id === id);
      if (f) bukaFormSingle(f);
    }
  };

  cariInput.oninput = gambarDaftar;

  $('#btn-tambah-fitting', el).onclick = () => bukaFormSingle();
  $('#btn-tambah-banyak', el).onclick = () => bukaFormBuatBanyak();

  const btnImport = $('#btn-import-fitting', el);
  if (btnImport) {
    btnImport.onclick = () => {
      ExportImport.importFittingModal(async () => {
        semua = await DataStore.getFitting();
        gambarDaftar();
      });
    };
  }

  const btnExport = $('#btn-export-fitting', el);
  if (btnExport) {
    btnExport.onclick = () => {
      ExportImport.exportFitting();
    };
  }

  gambarDaftar();
};
