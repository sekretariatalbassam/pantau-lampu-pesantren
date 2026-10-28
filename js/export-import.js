/* ============================================================
   Pantau Lampu Pesantren - Modul Export & Import CSV (Excel)
   Mendukung: Master Lokasi & Titik Dudukan Fitting
   Format: CSV UTF-8 dengan BOM (Bisa langsung dibuka di MS Excel & Google Sheets)
   ============================================================ */

const ExportImport = {
  // Unduh string teks sebagai file di browser
  downloadFile(filename, content, mimeType = 'text/csv;charset=utf-8;') {
    const blob = new Blob(['\uFEFF' + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  },

  // Konversi array object ke string CSV
  toCsv(headers, rows) {
    const escapeCell = (val) => {
      if (val == null) return '""';
      const str = String(val);
      if (str.includes(',') || str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const barisHeader = headers.map(h => escapeCell(h.label || h.key)).join(',');
    const barisData = rows.map(r => {
      return headers.map(h => escapeCell(h.get ? h.get(r) : r[h.key] ?? '')).join(',');
    });

    return [barisHeader, ...barisData].join('\r\n');
  },

  // Parser CSV pintar: mendeteksi pemisah koma (,) atau titik-koma (;)
  parseCsv(text) {
    if (!text || !text.trim()) return { headers: [], rows: [] };

    // Hapus BOM jika ada
    let cleanText = text.replace(/^\uFEFF/, '').trim();

    // Deteksi pemisah di baris pertama
    const barisPertama = cleanText.split(/\r\n|\n|\r/)[0];
    const komaCount = (barisPertama.match(/,/g) || []).length;
    const titikKomaCount = (barisPertama.match(/;/g) || []).length;
    const delim = titikKomaCount > komaCount ? ';' : ',';

    const result = [];
    let row = [];
    let inQuotes = false;
    let curVal = '';

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          curVal += '"';
          i++; // Lewati quote kedua
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delim && !inQuotes) {
        row.push(curVal.trim());
        curVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++; // CRLF
        row.push(curVal.trim());
        if (row.some(c => c !== '')) result.push(row);
        row = [];
        curVal = '';
      } else {
        curVal += char;
      }
    }
    if (curVal || row.length) {
      row.push(curVal.trim());
      if (row.some(c => c !== '')) result.push(row);
    }

    if (result.length < 2) return { headers: [], rows: [] };

    const headers = result[0].map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
    const dataRows = result.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = (r[idx] != null ? r[idx].replace(/^["']|["']$/g, '').trim() : '');
      });
      return obj;
    });

    return { headers, rows: dataRows };
  },

  /* ============================================================
     EXPORT & IMPORT: MASTER LOKASI
     ============================================================ */

  // 1. Export Lokasi ke CSV
  async exportLokasi() {
    const data = await DataStore.getLokasi();
    if (!data.length) {
      toast('Belum ada data lokasi untuk diekspor.', 'warn');
      return;
    }

    const headers = [
      { key: 'gedung', label: 'Gedung' },
      { key: 'lantai', label: 'Lantai' },
      { key: 'ruang', label: 'Ruang' },
      { key: 'keterangan', label: 'Keterangan' }
    ];

    const csvStr = this.toCsv(headers, data);
    const tgl = new Date().toISOString().split('T')[0];
    this.downloadFile(`master_lokasi_pesantren_${tgl}.csv`, csvStr);
    toast(`Berhasil mengekspor ${data.length} lokasi!`);
  },

  // 2. Unduh Template CSV Lokasi
  downloadTemplateLokasi() {
    const headers = [
      { key: 'gedung', label: 'Gedung' },
      { key: 'lantai', label: 'Lantai' },
      { key: 'ruang', label: 'Ruang' },
      { key: 'keterangan', label: 'Keterangan' }
    ];

    const contoh = [
      { gedung: 'Masjid Jami', lantai: '1', ruang: 'Ruang Sholat Utama', keterangan: 'Area ibadah santri & asatidz' },
      { gedung: 'Asrama Putra', lantai: '1', ruang: 'Kamar Abu Bakar (101)', keterangan: 'Kamar santri putra lt 1' },
      { gedung: 'Madrasah', lantai: '2', ruang: 'Kelas 3 Tahfizh', keterangan: 'Ruang kelas belajar' }
    ];

    const csvStr = this.toCsv(headers, contoh);
    this.downloadFile('template_import_lokasi.csv', csvStr);
    toast('Template lokasi berhasil diunduh. Silakan buka & isi di Excel.');
  },

  // 3. Modal Dialog Import Lokasi
  importLokasiModal(onSelesai) {
    bukaModal('📥 Import Master Lokasi (Excel / CSV)', `
      <div style="font-size:0.9rem;">
        <p class="muted">Upload file CSV dari Microsoft Excel atau Google Sheets. Kolom yang dibutuhkan: <b>Gedung</b>, <b>Lantai</b>, <b>Ruang</b>, dan <b>Keterangan</b>.</p>
        
        <div class="row-btn mb-3">
          <button class="btn small" type="button" id="btn-modal-dl-tpl-lokasi">📄 Unduh Contoh Template CSV</button>
        </div>

        <label class="field mt-3">
          <span>Pilih File CSV (.csv) *</span>
          <input type="file" id="file-import-lokasi" accept=".csv, text/csv, text/plain">
        </label>

        <div id="preview-box-lokasi" class="mt-3" hidden></div>

        <div class="field mt-3" id="opsi-import-lokasi" hidden>
          <span>Metode Penyimpanan Data:</span>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="radio" name="mode_import_lokasi" value="tambah" checked>
              <span><b>Tambahkan ke data yang ada</b> (Data yang sudah ada tidak dihapus)</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="radio" name="mode_import_lokasi" value="ganti">
              <span class="text-danger"><b>Ganti semua data</b> (Kosongkan lokasi lama dan isi dengan file ini)</span>
            </label>
          </div>
        </div>

        <div class="row-btn mt-4">
          <button class="btn primary block" type="button" id="btn-eksekusi-import-lokasi" disabled>🚀 Mulai Proses Import</button>
          <button class="btn block" type="button" id="btn-batal-import-lokasi">Batal</button>
        </div>
      </div>
    `);

    $('#btn-modal-dl-tpl-lokasi').onclick = () => this.downloadTemplateLokasi();
    $('#btn-batal-import-lokasi').onclick = tutupModal;

    const fileInput = $('#file-import-lokasi');
    const previewBox = $('#preview-box-lokasi');
    const opsiBox = $('#opsi-import-lokasi');
    const btnProses = $('#btn-eksekusi-import-lokasi');

    let parsedData = [];

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const { headers, rows } = ExportImport.parseCsv(evt.target.result);
          if (!rows.length) {
            toast('File CSV kosong atau tidak memiliki data.', 'warn');
            return;
          }

          // Pemetaan kolom toleran
          parsedData = rows.map((r, idx) => {
            const gedung = r.gedung || r.area || r['nama gedung'] || '';
            const lantai = r.lantai || r['tingkat'] || '1';
            const ruang = r.ruang || r['nama ruang'] || r.kamar || r.kelas || '';
            const keterangan = r.keterangan || r.catatan || r.deskripsi || '';

            return {
              id: Date.now() + idx,
              gedung: gedung.trim(),
              lantai: lantai.trim(),
              ruang: ruang.trim(),
              keterangan: keterangan.trim()
            };
          }).filter(r => r.gedung && r.ruang);

          if (!parsedData.length) {
            toast('Tidak ditemukan data lokasi yang valid (Pastikan ada kolom Gedung dan Ruang).', 'err');
            return;
          }

          previewBox.hidden = false;
          opsiBox.hidden = false;
          btnProses.disabled = false;

          previewBox.innerHTML = `
            <div style="background:#f1f5f9;padding:10px 14px;border-radius:8px;">
              <b class="text-ok">✓ Siap Mengimpor ${parsedData.length} Data Lokasi:</b>
              <div style="max-height:140px;overflow-y:auto;margin-top:6px;font-size:0.8rem;background:#fff;border:1px solid #cbd5e1;border-radius:6px;padding:6px 10px;">
                ${parsedData.slice(0, 5).map(r => `<div>• <b>${esc(r.gedung)}</b> (Lt. ${esc(r.lantai)}) › ${esc(r.ruang)}</div>`).join('')}
                ${parsedData.length > 5 ? `<div class="muted">... dan ${parsedData.length - 5} lokasi lainnya</div>` : ''}
              </div>
            </div>
          `;
        } catch (err) {
          toast('Gagal membaca file CSV: ' + err.message, 'err');
        }
      };
      reader.readAsText(file);
    };

    btnProses.onclick = async () => {
      btnProses.disabled = true;
      btnProses.textContent = 'Menyimpan...';

      const mode = $('input[name="mode_import_lokasi"]:checked').value;
      if (mode === 'ganti') {
        DataStore.memory.lokasi = parsedData;
      } else {
        // Mode tambah: hindari duplikasi gedung + lantai + ruang
        const existing = new Set(DataStore.memory.lokasi.map(l => `${l.gedung}|${l.lantai}|${l.ruang}`.toLowerCase()));
        parsedData.forEach(p => {
          const key = `${p.gedung}|${p.lantai}|${p.ruang}`.toLowerCase();
          if (!existing.has(key)) {
            DataStore.memory.lokasi.push(p);
            existing.add(key);
          }
        });
      }

      DataStore.persist();
      tutupModal();
      toast(`Berhasil mengimpor data lokasi!`);
      if (typeof onSelesai === 'function') onSelesai();
    };
  },

  /* ============================================================
     EXPORT & IMPORT: TITIK FITTING LAMPU
     ============================================================ */

  // 1. Export Fitting ke CSV
  async exportFitting() {
    const data = await DataStore.getFitting();
    if (!data.length) {
      toast('Belum ada data titik fitting untuk diekspor.', 'warn');
      return;
    }

    const headers = [
      { key: 'kode', label: 'Kode_Fitting' },
      { key: 'gedung', label: 'Gedung', get: f => f.lokasi?.gedung || '' },
      { key: 'lantai', label: 'Lantai', get: f => f.lokasi?.lantai || '' },
      { key: 'ruang', label: 'Ruang', get: f => f.lokasi?.ruang || '' },
      { key: 'merk', label: 'Merk_Lampu', get: f => f.jenis_lampu?.merk || '' },
      { key: 'jenis', label: 'Jenis_Lampu', get: f => f.jenis_lampu?.jenis || '' },
      { key: 'watt', label: 'Watt', get: f => f.jenis_lampu?.watt || '' },
      { key: 'tanggal_pasang', label: 'Tanggal_Pasang' },
      { key: 'pemasang', label: 'Pemasang' },
      { key: 'status', label: 'Status' },
      { key: 'keterangan', label: 'Keterangan' }
    ];

    const csvStr = this.toCsv(headers, data);
    const tgl = new Date().toISOString().split('T')[0];
    this.downloadFile(`fitting_lampu_pesantren_${tgl}.csv`, csvStr);
    toast(`Berhasil mengekspor ${data.length} fitting!`);
  },

  // 2. Unduh Template CSV Fitting
  downloadTemplateFitting() {
    const headers = [
      { key: 'kode', label: 'Kode_Fitting' },
      { key: 'gedung', label: 'Gedung' },
      { key: 'lantai', label: 'Lantai' },
      { key: 'ruang', label: 'Ruang' },
      { key: 'merk', label: 'Merk_Lampu' },
      { key: 'jenis', label: 'Jenis_Lampu' },
      { key: 'watt', label: 'Watt' },
      { key: 'tanggal_pasang', label: 'Tanggal_Pasang' },
      { key: 'pemasang', label: 'Pemasang' },
      { key: 'status', label: 'Status' },
      { key: 'keterangan', label: 'Keterangan' }
    ];

    const today = new Date().toISOString().split('T')[0];
    const contoh = [
      {
        kode: 'F-001',
        gedung: 'Asrama Putra',
        lantai: '1',
        ruang: 'Kamar Abu Bakar (101)',
        merk: 'Philips',
        jenis: 'LED MyCare Bulb',
        watt: 10,
        tanggal_pasang: today,
        pemasang: 'Ust. Ahmad',
        status: 'aktif',
        keterangan: 'Plafon tengah kamar'
      },
      {
        kode: 'F-002',
        gedung: 'Masjid Jami',
        lantai: '1',
        ruang: 'Ruang Sholat Utama',
        merk: 'Philips',
        jenis: 'LED MyCare Bulb',
        watt: 14,
        tanggal_pasang: today,
        pemasang: 'Pak Joko',
        status: 'aktif',
        keterangan: 'Shaf depan dekat mimbar'
      },
      {
        kode: 'F-003',
        gedung: 'Madrasah',
        lantai: '1',
        ruang: 'Kelas 1 Tahfizh',
        merk: 'Hannochs',
        jenis: 'Premier LED',
        watt: 12,
        tanggal_pasang: today,
        pemasang: 'Ust. Ridwan',
        status: 'aktif',
        keterangan: 'Lampu penerangan papan tulis'
      }
    ];

    const csvStr = this.toCsv(headers, contoh);
    this.downloadFile('template_import_fitting.csv', csvStr);
    toast('Template fitting berhasil diunduh. Silakan isi di Excel lalu upload kembali.');
  },

  // 3. Modal Dialog Import Fitting
  importFittingModal(onSelesai) {
    bukaModal('📥 Import Titik Fitting (Excel / CSV)', `
      <div style="font-size:0.9rem;">
        <p class="muted">Upload file CSV berisi daftar titik fitting lampu. Jika nama Gedung atau Jenis Lampu di file belum ada di Master, sistem akan <b>otomatis mendaftarkannya</b>.</p>
        
        <div class="row-btn mb-3">
          <button class="btn small" type="button" id="btn-modal-dl-tpl-fitting">📄 Unduh Contoh Template CSV</button>
        </div>

        <label class="field mt-3">
          <span>Pilih File CSV (.csv) *</span>
          <input type="file" id="file-import-fitting" accept=".csv, text/csv, text/plain">
        </label>

        <div id="preview-box-fitting" class="mt-3" hidden></div>

        <div class="field mt-3" id="opsi-import-fitting" hidden>
          <span>Metode Penyimpanan Data:</span>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="radio" name="mode_import_fitting" value="tambah" checked>
              <span><b>Update & Tambahkan</b> (Update jika kode sudah ada, tambah jika kode baru)</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="radio" name="mode_import_fitting" value="ganti">
              <span class="text-danger"><b>Ganti semua data fitting</b> (Kosongkan fitting lama dan isi dengan file ini)</span>
            </label>
          </div>
        </div>

        <div class="row-btn mt-4">
          <button class="btn primary block" type="button" id="btn-eksekusi-import-fitting" disabled>🚀 Mulai Proses Import</button>
          <button class="btn block" type="button" id="btn-batal-import-fitting">Batal</button>
        </div>
      </div>
    `);

    $('#btn-modal-dl-tpl-fitting').onclick = () => this.downloadTemplateFitting();
    $('#btn-batal-import-fitting').onclick = tutupModal;

    const fileInput = $('#file-import-fitting');
    const previewBox = $('#preview-box-fitting');
    const opsiBox = $('#opsi-import-fitting');
    const btnProses = $('#btn-eksekusi-import-fitting');

    let parsedRaw = [];

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const { headers, rows } = ExportImport.parseCsv(evt.target.result);
          if (!rows.length) {
            toast('File CSV kosong.', 'warn');
            return;
          }

          parsedRaw = rows.map((r, idx) => {
            const kode = (r.kode_fitting || r.kode || r['no fitting'] || r['nomor'] || `F-${String(idx + 1).padStart(3, '0')}`).toUpperCase();
            const gedung = r.gedung || r.area || '';
            const lantai = r.lantai || '1';
            const ruang = r.ruang || r.kamar || r.kelas || '';
            const merk = r.merk_lampu || r.merk || 'Philips';
            const jenis = r.jenis_lampu || r.jenis || 'LED Bulb';
            const watt = parseInt(r.watt || r.daya || '10', 10) || 10;
            const tgl = r.tanggal_pasang || r.tanggal || new Date().toISOString().split('T')[0];
            const pemasang = r.pemasang || r.petugas || 'Teknisi';
            const status = (r.status || 'aktif').toLowerCase() === 'kosong' ? 'kosong' : 'aktif';
            const ket = r.keterangan || r.catatan || '';

            return { kode, gedung, lantai, ruang, merk, jenis, watt, tanggal_pasang: tgl, pemasang, status, keterangan: ket };
          }).filter(r => r.kode);

          if (!parsedRaw.length) {
            toast('Tidak ada data fitting yang valid di file CSV.', 'err');
            return;
          }

          previewBox.hidden = false;
          opsiBox.hidden = false;
          btnProses.disabled = false;

          previewBox.innerHTML = `
            <div style="background:#f1f5f9;padding:10px 14px;border-radius:8px;">
              <b class="text-ok">✓ Ditemukan ${parsedRaw.length} Titik Fitting Siap Diimpor:</b>
              <div style="max-height:140px;overflow-y:auto;margin-top:6px;font-size:0.8rem;background:#fff;border:1px solid #cbd5e1;border-radius:6px;padding:6px 10px;">
                ${parsedRaw.slice(0, 5).map(r => `<div>• <b>${esc(r.kode)}</b> — ${esc(r.gedung)} (${esc(r.ruang)}) | ${esc(r.merk)} ${r.watt}W</div>`).join('')}
                ${parsedRaw.length > 5 ? `<div class="muted">... dan ${parsedRaw.length - 5} fitting lainnya</div>` : ''}
              </div>
            </div>
          `;
        } catch (err) {
          toast('Gagal memproses file CSV: ' + err.message, 'err');
        }
      };
      reader.readAsText(file);
    };

    btnProses.onclick = async () => {
      btnProses.disabled = true;
      btnProses.textContent = 'Memproses...';

      const mode = $('input[name="mode_import_fitting"]:checked').value;
      if (mode === 'ganti') {
        DataStore.memory.fitting = [];
      }

      // Pastikan master lokasi dan jenis lampu tersedia atau otomatis dibuatkan
      let lokasiList = DataStore.memory.lokasi;
      let jenisList = DataStore.memory.jenis_lampu;

      parsedRaw.forEach((row, i) => {
        // 1. Cari atau buat Lokasi
        let lokId = null;
        if (row.gedung && row.ruang) {
          let foundLok = lokasiList.find(l =>
            l.gedung.toLowerCase() === row.gedung.toLowerCase() &&
            l.ruang.toLowerCase() === row.ruang.toLowerCase()
          );
          if (!foundLok) {
            foundLok = {
              id: Date.now() + i * 10 + 1,
              gedung: row.gedung,
              lantai: row.lantai || '1',
              ruang: row.ruang,
              keterangan: 'Auto-import'
            };
            lokasiList.push(foundLok);
          }
          lokId = foundLok.id;
        }

        // 2. Cari atau buat Jenis Lampu
        let jenisId = null;
        if (row.merk) {
          let foundJenis = jenisList.find(j =>
            j.merk.toLowerCase() === row.merk.toLowerCase() &&
            Number(j.watt) === Number(row.watt)
          );
          if (!foundJenis) {
            foundJenis = {
              id: Date.now() + i * 10 + 2,
              merk: row.merk,
              jenis: row.jenis || 'LED Bulb',
              watt: Number(row.watt) || 10,
              masa_pakai_jam: 15000,
              keterangan: 'Auto-import'
            };
            jenisList.push(foundJenis);
          }
          jenisId = foundJenis.id;
        }

        // 3. Masukkan / Update Fitting
        const existingIdx = DataStore.memory.fitting.findIndex(f => f.kode.toUpperCase() === row.kode.toUpperCase());
        const fittingObj = {
          id: existingIdx >= 0 ? DataStore.memory.fitting[existingIdx].id : Date.now() + i * 10 + 3,
          kode: row.kode,
          lokasi_id: lokId,
          jenis_lampu_id: jenisId,
          tanggal_pasang: row.tanggal_pasang,
          pemasang: row.pemasang,
          status: row.status,
          keterangan: row.keterangan
        };

        if (existingIdx >= 0) {
          DataStore.memory.fitting[existingIdx] = fittingObj;
        } else {
          DataStore.memory.fitting.push(fittingObj);
        }
      });

      // Urutkan kode fitting
      DataStore.memory.fitting.sort(urutKode);
      DataStore.persist();

      tutupModal();
      toast(`Berhasil mengimpor ${parsedRaw.length} titik fitting lampu!`);
      if (typeof onSelesai === 'function') onSelesai();
    };
  }
};
