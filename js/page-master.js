/* ============================================================
   Halaman master data: Lokasi dan Jenis Lampu
   ============================================================ */

Pages.lokasi = buatHalamanCrud({
  table: 'lokasi',
  judul: 'Master Lokasi Pesantren',
  tunggal: 'lokasi',
  urut: ['gedung', 'lantai', 'ruang'],
  bantuan: 'Tempat fitting dipasang di pesantren. Bisa diekspor/diimpor via file Excel atau CSV.',
  extraButtonsHtml: `
    <button class="btn small" id="btn-import-lokasi" type="button">📥 Import CSV</button>
    <button class="btn small" id="btn-export-lokasi" type="button">📤 Export CSV</button>
  `,
  initExtra: (el, muatUlang) => {
    const btnImp = $('#btn-import-lokasi', el);
    if (btnImp) btnImp.onclick = () => ExportImport.importLokasiModal(muatUlang);

    const btnExp = $('#btn-export-lokasi', el);
    if (btnExp) btnExp.onclick = () => ExportImport.exportLokasi();
  },
  fields: [
    { key: 'gedung', label: 'Area / Gedung', required: true, placeholder: 'mis. Gedung A, Masjid, Asrama Putra' },
    { key: 'lantai', label: 'Lantai', placeholder: 'mis. 1, 2, Dasar' },
    { key: 'ruang', label: 'Ruang', placeholder: 'mis. Kelas 2B, Koridor, Kamar mandi' },
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ],
  kolom: [
    { key: 'gedung', label: 'Gedung' },
    { key: 'lantai', label: 'Lantai' },
    { key: 'ruang', label: 'Ruang' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  ringkas: (r) => labelLokasi(r),
  peringatanHapus: 'Fitting di lokasi ini tidak ikut terhapus, hanya lokasinya jadi kosong.',
});

Pages.jenis = buatHalamanCrud({
  table: 'jenis_lampu',
  judul: 'Jenis Lampu',
  tunggal: 'jenis lampu',
  urut: ['merk', 'jenis', 'watt'],
  bantuan: 'Daftar merk/jenis lampu yang dipakai. <b>Masa pakai wajar</b> dipakai untuk menandai lampu yang rusak lebih cepat dari seharusnya.',
  fields: [
    { key: 'merk', label: 'Merk', required: true, placeholder: 'mis. Philips, Hannochs' },
    { key: 'jenis', label: 'Jenis', required: true, saran: ['LED', 'TL / Neon', 'CFL (hemat energi)', 'Pijar', 'Halogen', 'Lampu sorot'] },
    { key: 'watt', label: 'Daya (watt)', type: 'number', min: 1 },
    {
      key: 'masa_pakai_jam', label: 'Masa pakai wajar (jam nyala)', type: 'number', min: 1,
      bantuan: 'Lihat tulisan di kemasan. Umumnya: LED 15.000–25.000 jam, TL 6.000–10.000, CFL 6.000–8.000, pijar 1.000.',
    },
    { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  ],
  kolom: [
    { key: 'merk', label: 'Merk' },
    { key: 'jenis', label: 'Jenis' },
    { key: 'watt', label: 'Watt', fmt: (r) => r.watt ?? '' },
    { key: 'masa_pakai_jam', label: 'Masa pakai (jam)', fmt: (r) => r.masa_pakai_jam ? r.masa_pakai_jam.toLocaleString('id-ID') : '' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  ringkas: (r) => labelJenis(r),
  peringatanHapus: 'Fitting yang memakai jenis ini tidak ikut terhapus, hanya jenis lampunya jadi kosong.',
});
