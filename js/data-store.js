/* ============================================================
   Pantau Lampu - Data Store & Layanan Terintegrasi
   Mendukung: LocalStorage Cepat (Instan 0 detik) + Supabase Cloud
   ============================================================ */

const SEED_DATA = {
  lokasi: [
    { id: 1, gedung: 'Asrama Putra', lantai: '1', ruang: 'Kamar 101 (Abu Bakar)', keterangan: 'Kamar santri putra' },
    { id: 2, gedung: 'Asrama Putra', lantai: '1', ruang: 'Kamar 102 (Umar)', keterangan: 'Kamar santri putra' },
    { id: 3, gedung: 'Asrama Putra', lantai: '2', ruang: 'Kamar 201 (Utsman)', keterangan: 'Kamar santri putra lt. 2' },
    { id: 4, gedung: 'Asrama Putra', lantai: '2', ruang: 'Kamar 202 (Ali)', keterangan: 'Kamar santri putra lt. 2 (Area Rawan)' },
    { id: 5, gedung: 'Asrama Putra', lantai: '1', ruang: 'Kamar Mandi & Wudhu Putra', keterangan: 'Area lembap/basah' },
    { id: 6, gedung: 'Asrama Putra', lantai: '2', ruang: 'Koridor & Selasar Lt. 2', keterangan: 'Area lalu lalang santri' },
    { id: 7, gedung: 'Masjid Jami', lantai: '1', ruang: 'Ruang Utama Sholat', keterangan: 'Lampu gantung & plafon' },
    { id: 8, gedung: 'Masjid Jami', lantai: '1', ruang: 'Teras & Selasar Depan', keterangan: 'Area outdoor terlindung' },
    { id: 9, gedung: 'Madrasah', lantai: '1', ruang: 'Kelas 1 Tahfizh', keterangan: 'Ruang belajar' },
    { id: 10, gedung: 'Madrasah', lantai: '1', ruang: 'Kelas 2 Tahfizh', keterangan: 'Ruang belajar' },
    { id: 11, gedung: 'Madrasah', lantai: '2', ruang: 'Kelas 3 Tahfizh', keterangan: 'Ruang belajar' },
    { id: 12, gedung: 'Asrama Putri', lantai: '1', ruang: 'Kamar Khadijah', keterangan: 'Kamar santriwati' }
  ],
  jenis_lampu: [
    { id: 1, merk: 'Philips', jenis: 'LED MyCare', watt: 14, masa_pakai_jam: 15000, keterangan: 'Tahan lama, cahaya putih terang' },
    { id: 2, merk: 'Philips', jenis: 'LED MyCare', watt: 10, masa_pakai_jam: 15000, keterangan: 'Untuk kamar tidur santri' },
    { id: 3, merk: 'Hannochs', jenis: 'Premier LED', watt: 12, masa_pakai_jam: 10000, keterangan: 'Ekonomis, untuk kelas' },
    { id: 4, merk: 'Hannochs', jenis: 'Vario LED', watt: 9, masa_pakai_jam: 8000, keterangan: 'Untuk koridor & selasar' },
    { id: 5, merk: 'Osram', jenis: 'LED Value', watt: 12, masa_pakai_jam: 12000, keterangan: 'Untuk teras dan selasar' },
    { id: 6, merk: 'In-Lite', jenis: 'LED Bulb', watt: 11, masa_pakai_jam: 10000, keterangan: 'Alternatif hemat' }
  ],
  fitting: [
    { id: 1, kode: 'F-001', lokasi_id: 1, jenis_lampu_id: 2, tanggal_pasang: '2026-05-10', pemasang: 'Ust. Ahmad', status: 'aktif', keterangan: 'Tengah plafon' },
    { id: 2, kode: 'F-002', lokasi_id: 1, jenis_lampu_id: 2, tanggal_pasang: '2026-05-10', pemasang: 'Ust. Ahmad', status: 'aktif', keterangan: 'Dekat pintu masuk' },
    { id: 3, kode: 'F-003', lokasi_id: 2, jenis_lampu_id: 2, tanggal_pasang: '2026-06-15', pemasang: 'Pak Joko (Teknisi)', status: 'aktif', keterangan: 'Tengah plafon' },
    { id: 4, kode: 'F-004', lokasi_id: 4, jenis_lampu_id: 4, tanggal_pasang: '2026-10-02', pemasang: 'Ust. Ahmad', status: 'kosong', keterangan: 'Lampu pecah dilempar bantal santri' },
    { id: 5, kode: 'F-005', lokasi_id: 4, jenis_lampu_id: 4, tanggal_pasang: '2026-09-20', pemasang: 'Ust. Ahmad', status: 'aktif', keterangan: 'Pojok belakang lemari' },
    { id: 6, kode: 'F-006', lokasi_id: 6, jenis_lampu_id: 4, tanggal_pasang: '2026-08-11', pemasang: 'Pak Joko', status: 'aktif', keterangan: 'Lampu selasar lantai 2' },
    { id: 7, kode: 'F-007', lokasi_id: 5, jenis_lampu_id: 3, tanggal_pasang: '2026-09-01', pemasang: 'Pak Joko', status: 'kosong', keterangan: 'Fiting kena tetesan air bocor' },
    { id: 8, kode: 'F-008', lokasi_id: 5, jenis_lampu_id: 3, tanggal_pasang: '2026-07-10', pemasang: 'Pak Joko', status: 'aktif', keterangan: 'Area wudhu' },
    { id: 9, kode: 'F-009', lokasi_id: 7, jenis_lampu_id: 1, tanggal_pasang: '2026-01-15', pemasang: 'Pak Joko', status: 'aktif', keterangan: 'Plafon imam masjid' },
    { id: 10, kode: 'F-010', lokasi_id: 7, jenis_lampu_id: 1, tanggal_pasang: '2026-01-15', pemasang: 'Pak Joko', status: 'aktif', keterangan: 'Shaf depan tengah' },
    { id: 11, kode: 'F-011', lokasi_id: 8, jenis_lampu_id: 5, tanggal_pasang: '2026-03-20', pemasang: 'Ust. Ahmad', status: 'aktif', keterangan: 'Teras depan masjid' },
    { id: 12, kode: 'F-012', lokasi_id: 9, jenis_lampu_id: 3, tanggal_pasang: '2026-04-05', pemasang: 'Ust. Ridwan', status: 'aktif', keterangan: 'Papan tulis kelas 1' },
    { id: 13, kode: 'F-013', lokasi_id: 9, jenis_lampu_id: 3, tanggal_pasang: '2026-04-05', pemasang: 'Ust. Ridwan', status: 'aktif', keterangan: 'Tengah kelas 1' },
    { id: 14, kode: 'F-014', lokasi_id: 10, jenis_lampu_id: 3, tanggal_pasang: '2026-04-05', pemasang: 'Ust. Ridwan', status: 'aktif', keterangan: 'Kelas 2 tahfizh' },
    { id: 15, kode: 'F-015', lokasi_id: 11, jenis_lampu_id: 3, tanggal_pasang: '2026-04-05', pemasang: 'Ust. Ridwan', status: 'aktif', keterangan: 'Kelas 3 tahfizh' },
    { id: 16, kode: 'F-016', lokasi_id: 12, jenis_lampu_id: 2, tanggal_pasang: '2026-02-14', pemasang: 'Usth. Sarah', status: 'aktif', keterangan: 'Kamar asrama putri' },
    { id: 17, kode: 'F-017', lokasi_id: 3, jenis_lampu_id: 2, tanggal_pasang: '2026-06-10', pemasang: 'Ust. Ahmad', status: 'aktif', keterangan: 'Kamar 201' },
    { id: 18, kode: 'F-018', lokasi_id: 6, jenis_lampu_id: 4, tanggal_pasang: '2026-07-22', pemasang: 'Pak Joko', status: 'aktif', keterangan: 'Balkon asrama putra' },
    { id: 19, kode: 'F-019', lokasi_id: 7, jenis_lampu_id: 1, tanggal_pasang: '2026-01-15', pemasang: 'Pak Joko', status: 'aktif', keterangan: 'Shaf belakang masjid' },
    { id: 20, kode: 'F-020', lokasi_id: 8, jenis_lampu_id: 5, tanggal_pasang: '2026-03-20', pemasang: 'Ust. Ahmad', status: 'aktif', keterangan: 'Selasar samping masjid' }
  ],
  stok_mutasi: [
    { id: 1, tanggal: '2026-01-10', jenis_lampu_id: 1, arah: 'masuk', jumlah: 20, keterangan: 'Pembelian stok awal tahun (Toko Listrik Berkah)', dibuat_oleh: 'Admin' },
    { id: 2, tanggal: '2026-01-10', jenis_lampu_id: 2, arah: 'masuk', jumlah: 30, keterangan: 'Pembelian stok awal tahun', dibuat_oleh: 'Admin' },
    { id: 3, tanggal: '2026-01-10', jenis_lampu_id: 3, arah: 'masuk', jumlah: 25, keterangan: 'Pembelian stok awal tahun', dibuat_oleh: 'Admin' },
    { id: 4, tanggal: '2026-01-10', jenis_lampu_id: 4, arah: 'masuk', jumlah: 20, keterangan: 'Pembelian stok awal tahun', dibuat_oleh: 'Admin' },
    { id: 5, tanggal: '2026-01-10', jenis_lampu_id: 5, arah: 'masuk', jumlah: 15, keterangan: 'Pembelian stok awal tahun', dibuat_oleh: 'Admin' },
    { id: 6, tanggal: '2026-01-15', jenis_lampu_id: 1, arah: 'keluar', jumlah: 3, keterangan: 'Pemasangan Masjid F-009, F-010, F-019', dibuat_oleh: 'Pak Joko' },
    { id: 7, tanggal: '2026-05-10', jenis_lampu_id: 2, arah: 'keluar', jumlah: 4, keterangan: 'Pemasangan Asrama Putra F-001, F-002', dibuat_oleh: 'Ust. Ahmad' },
    { id: 8, tanggal: '2026-08-15', jenis_lampu_id: 4, arah: 'masuk', jumlah: 10, keterangan: 'Droping tambahan dari donatur', dibuat_oleh: 'Admin' },
    { id: 9, tanggal: '2026-09-20', jenis_lampu_id: 4, arah: 'keluar', jumlah: 2, keterangan: 'Ganti lampu selasar & kamar 202', dibuat_oleh: 'Ust. Ahmad' },
    { id: 10, tanggal: '2026-10-02', jenis_lampu_id: 4, arah: 'keluar', jumlah: 1, keterangan: 'Penggantian lampu pecah di F-004', dibuat_oleh: 'Ust. Ahmad' }
  ],
  penggantian: [
    {
      id: 1,
      fitting_id: 4,
      tanggal: '2026-07-15',
      alasan: 'dimainkan_santri',
      catatan: 'Lampu pecah tersenggol bantal saat santri bercanda di kamar',
      jenis_lama_id: 4,
      jenis_baru_id: 4,
      tanggal_pasang_lama: '2026-05-10',
      usia_hari: 66,
      rusak_dini: true,
      indikasi_santri: true,
      pemasang: 'Ust. Ahmad'
    },
    {
      id: 2,
      fitting_id: 4,
      tanggal: '2026-10-02',
      alasan: 'dimainkan_santri',
      catatan: 'Lampu copot dan fiting kendur, santri memasang kabel rakitan kipas angin',
      jenis_lama_id: 4,
      jenis_baru_id: 4,
      tanggal_pasang_lama: '2026-07-15',
      usia_hari: 79,
      rusak_dini: true,
      indikasi_santri: true,
      pemasang: 'Ust. Ahmad'
    },
    {
      id: 3,
      fitting_id: 6,
      tanggal: '2026-08-11',
      alasan: 'hilang',
      catatan: 'Lampu di selasar hilang, kemungkinan dipindahkan santri ke kamar',
      jenis_lama_id: 4,
      jenis_baru_id: 4,
      tanggal_pasang_lama: '2026-03-01',
      usia_hari: 163,
      rusak_dini: false,
      indikasi_santri: true,
      pemasang: 'Pak Joko'
    },
    {
      id: 4,
      fitting_id: 7,
      tanggal: '2026-09-01',
      alasan: 'konslet',
      catatan: 'Kamar mandi lembap dan atap bocor menetes ke fiting sehingga putus',
      jenis_lama_id: 3,
      jenis_baru_id: 3,
      tanggal_pasang_lama: '2026-04-10',
      usia_hari: 144,
      rusak_dini: true,
      indikasi_santri: false,
      pemasang: 'Pak Joko'
    },
    {
      id: 5,
      fitting_id: 11,
      tanggal: '2026-09-15',
      alasan: 'habis_masa_pakai',
      catatan: 'Lampu meredup lalu padam wajar setelah pemakaian lama',
      jenis_lama_id: 5,
      jenis_baru_id: 5,
      tanggal_pasang_lama: '2025-06-10',
      usia_hari: 462,
      rusak_dini: false,
      indikasi_santri: false,
      pemasang: 'Pak Joko'
    },
    {
      id: 6,
      fitting_id: 3,
      tanggal: '2026-06-15',
      alasan: 'habis_masa_pakai',
      catatan: 'Penggantian rutin setelah masa pakai normal',
      jenis_lama_id: 2,
      jenis_baru_id: 2,
      tanggal_pasang_lama: '2025-05-01',
      usia_hari: 410,
      rusak_dini: false,
      indikasi_santri: false,
      pemasang: 'Pak Joko'
    }
  ]
};

const STORAGE_KEY = 'PANTAU_LAMPU_PESANTREN_V2';

class DataStoreService {
  constructor() {
    this.memory = null;
    this.supabaseFailed = false;
    this.init();
  }

  init() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.memory = JSON.parse(raw);
      } else {
        this.resetToSeed();
      }
    } catch (e) {
      console.warn('Gagal membaca localStorage, memakai seed memori:', e);
      this.resetToSeed();
    }
  }

  resetToSeed() {
    this.memory = JSON.parse(JSON.stringify(SEED_DATA));
    this.persist();
  }

  persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memory));
    } catch (e) {
      console.warn('Gagal simpan ke localStorage:', e);
    }
  }

  // Cek apakah Supabase aktif (langsung false bila dalam mode demo atau Supabase gagal/kosong)
  isSupabaseLive() {
    if (typeof App !== 'undefined' && App.isDemo) return false;
    if (this.supabaseFailed) return false;
    if (typeof App === 'undefined' || !App.db) return false;
    return true;
  }

  // Wrapper timeout agar tidak pernah menunggu lebih dari 1.5 detik
  async withTimeout(promise, ms = 1500) {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Koneksi Supabase lambat/timeout (>1.5s)')), ms);
    });
    try {
      const res = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      this.supabaseFailed = true;
      console.warn('Supabase tidak terjangkau, otomatis menggunakan Mode Lokal (Instan):', err.message);
      throw err;
    }
  }

  // Ambil semua data Master Lokasi (Instan 0ms dari memori)
  async getLokasi() {
    if (this.isSupabaseLive()) {
      try {
        const { data, error } = await this.withTimeout(
          App.db.from('lokasi').select('*').order('gedung').order('lantai').order('ruang')
        );
        if (!error && data) return data;
      } catch (e) {}
    }
    return this.memory.lokasi;
  }

  // Ambil semua Jenis Lampu (Instan 0ms)
  async getJenisLampu() {
    if (this.isSupabaseLive()) {
      try {
        const { data, error } = await this.withTimeout(
          App.db.from('jenis_lampu').select('*').order('merk').order('jenis')
        );
        if (!error && data) return data;
      } catch (e) {}
    }
    return this.memory.jenis_lampu;
  }

  // Ambil data Fitting (Instan 0ms)
  async getFitting() {
    const lokasiMap = new Map(this.memory.lokasi.map(l => [l.id, l]));
    const jenisMap = new Map(this.memory.jenis_lampu.map(j => [j.id, j]));

    if (this.isSupabaseLive()) {
      try {
        const { data, error } = await this.withTimeout(
          App.db.from('fitting').select('*, lokasi(gedung,lantai,ruang), jenis_lampu(merk,jenis,watt,masa_pakai_jam)')
        );
        if (!error && data) {
          return data.sort(urutKode);
        }
      } catch (e) {}
    }

    return this.memory.fitting.map(f => ({
      ...f,
      lokasi: lokasiMap.get(f.lokasi_id) || null,
      jenis_lampu: jenisMap.get(f.jenis_lampu_id) || null
    })).sort(urutKode);
  }

  async getFittingByKode(kodeBersih) {
    const cari = String(kodeBersih).trim().toUpperCase();
    const fittingList = await this.getFitting();
    return fittingList.find(f => f.kode.toUpperCase() === cari) || null;
  }

  // Ambil Riwayat Penggantian (Instan 0ms)
  async getPenggantian() {
    const fittingMap = new Map(this.memory.fitting.map(f => {
      const lok = this.memory.lokasi.find(l => l.id === f.lokasi_id);
      return [f.id, { ...f, lokasi: lok }];
    }));
    const jenisMap = new Map(this.memory.jenis_lampu.map(j => [j.id, j]));

    if (this.isSupabaseLive()) {
      try {
        const { data, error } = await this.withTimeout(
          App.db.from('penggantian').select('*').order('tanggal', { ascending: false })
        );
        if (!error && data) {
          return data.map(p => ({
            ...p,
            fitting: fittingMap.get(p.fitting_id) || null,
            jenis_lama: jenisMap.get(p.jenis_lama_id) || null,
            jenis_baru: jenisMap.get(p.jenis_baru_id) || null
          }));
        }
      } catch (e) {}
    }

    return this.memory.penggantian.map(p => ({
      ...p,
      fitting: fittingMap.get(p.fitting_id) || null,
      jenis_lama: jenisMap.get(p.jenis_lama_id) || null,
      jenis_baru: jenisMap.get(p.jenis_baru_id) || null
    })).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }

  // Ambil Mutasi Stok (Instan 0ms)
  async getMutasiStok() {
    const jenisMap = new Map(this.memory.jenis_lampu.map(j => [j.id, j]));

    if (this.isSupabaseLive()) {
      try {
        const { data, error } = await this.withTimeout(
          App.db.from('stok_mutasi').select('*').order('tanggal', { ascending: false })
        );
        if (!error && data) {
          return data.map(m => ({ ...m, jenis_lampu: jenisMap.get(m.jenis_lampu_id) || null }));
        }
      } catch (e) {}
    }

    return this.memory.stok_mutasi.map(m => ({
      ...m,
      jenis_lampu: jenisMap.get(m.jenis_lampu_id) || null
    })).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }

  // Hitung Sisa Stok Real-time (Instan 0ms)
  async getStokRingkasan() {
    const jenisList = this.memory.jenis_lampu;
    const mutasi = this.memory.stok_mutasi;

    return jenisList.map(j => {
      let masuk = 0;
      let keluar = 0;
      mutasi.filter(m => m.jenis_lampu_id === j.id).forEach(m => {
        if (m.arah === 'masuk') masuk += Number(m.jumlah || 0);
        else if (m.arah === 'keluar') keluar += Number(m.jumlah || 0);
      });
      const sisa = masuk - keluar;
      return {
        ...j,
        total_masuk: masuk,
        total_keluar: keluar,
        sisa: Math.max(0, sisa),
        status_stok: sisa <= 0 ? 'habis' : sisa <= 5 ? 'menipis' : 'aman'
      };
    });
  }

  // Tambah Penggantian Baru (Instan)
  async catatPenggantian(payload) {
    const {
      fitting_id,
      alasan,
      catatan,
      jenis_baru_id,
      tanggal,
      potong_stok,
      pemasang,
      indikasi_santri
    } = payload;

    const fitting = this.memory.fitting.find(f => f.id === Number(fitting_id));
    if (!fitting) throw new Error('Fitting tidak ditemukan');

    const jenisLamaId = fitting.jenis_lampu_id;
    const tglPasangLama = fitting.tanggal_pasang;
    let usiaHari = null;
    let rusakDini = false;

    if (tglPasangLama && tanggal) {
      const ms = new Date(tanggal).getTime() - new Date(tglPasangLama).getTime();
      usiaHari = Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
      if (usiaHari < 180 && alasan !== 'habis_masa_pakai') {
        rusakDini = true;
      }
    }

    const itemPenggantian = {
      id: Date.now(),
      fitting_id: Number(fitting_id),
      tanggal: tanggal || new Date().toISOString().split('T')[0],
      alasan: alasan || 'habis_masa_pakai',
      catatan: catatan || '',
      jenis_lama_id: jenisLamaId,
      jenis_baru_id: jenis_baru_id ? Number(jenis_baru_id) : jenisLamaId,
      tanggal_pasang_lama: tglPasangLama,
      usia_hari: usiaHari,
      rusak_dini: rusakDini,
      indikasi_santri: Boolean(indikasi_santri || alasan === 'dimainkan_santri' || alasan === 'hilang'),
      pemasang: pemasang || (typeof App !== 'undefined' ? App.profil?.nama : 'Petugas') || 'Petugas'
    };

    // Update data lokal
    this.memory.penggantian.unshift(itemPenggantian);

    const fIdx = this.memory.fitting.findIndex(f => f.id === Number(fitting_id));
    if (fIdx >= 0) {
      this.memory.fitting[fIdx].jenis_lampu_id = itemPenggantian.jenis_baru_id;
      this.memory.fitting[fIdx].tanggal_pasang = itemPenggantian.tanggal;
      this.memory.fitting[fIdx].pemasang = itemPenggantian.pemasang;
      this.memory.fitting[fIdx].status = 'aktif';
    }

    if (potong_stok && itemPenggantian.jenis_baru_id) {
      this.memory.stok_mutasi.unshift({
        id: Date.now() + 1,
        tanggal: itemPenggantian.tanggal,
        jenis_lampu_id: itemPenggantian.jenis_baru_id,
        arah: 'keluar',
        jumlah: 1,
        keterangan: `Penggantian di ${fitting.kode}`,
        dibuat_oleh: itemPenggantian.pemasang
      });
    }

    this.persist();

    // Async sync ke Supabase bila live (tanpa menghambat UI)
    if (this.isSupabaseLive()) {
      App.db.from('penggantian').insert([itemPenggantian]).then(() => {
        App.db.from('fitting').update({
          jenis_lampu_id: itemPenggantian.jenis_baru_id,
          tanggal_pasang: itemPenggantian.tanggal,
          pemasang: itemPenggantian.pemasang,
          status: 'aktif'
        }).eq('id', fitting_id);
      }).catch(err => console.warn('Sync background gagal:', err));
    }

    return itemPenggantian;
  }

  // Tambah Stok Masuk / Keluar (Instan)
  async catatMutasiStok(payload) {
    const item = {
      id: Date.now(),
      tanggal: payload.tanggal || new Date().toISOString().split('T')[0],
      jenis_lampu_id: Number(payload.jenis_lampu_id),
      arah: payload.arah,
      jumlah: Number(payload.jumlah),
      keterangan: payload.keterangan || '',
      dibuat_oleh: payload.dibuat_oleh || (typeof App !== 'undefined' ? App.profil?.nama : 'Petugas') || 'Petugas'
    };

    this.memory.stok_mutasi.unshift(item);
    this.persist();

    if (this.isSupabaseLive()) {
      App.db.from('stok_mutasi').insert([item]).catch(err => console.warn('Sync stok gagal:', err));
    }
    return item;
  }

  // Analisis Evaluasi Merk & Ketahanan (Instan)
  async getEvaluasiMerk() {
    const penggantian = this.memory.penggantian;
    const jenisLampu = this.memory.jenis_lampu;
    const jenisMap = new Map(jenisLampu.map(j => [j.id, j]));

    const merkMap = {};
    jenisLampu.forEach(j => {
      if (!merkMap[j.merk]) {
        merkMap[j.merk] = {
          merk: j.merk,
          total_pergantian: 0,
          total_hari: 0,
          data_hari_count: 0,
          rusak_dini: 0,
          dimainkan_santri: 0,
          putus_wajar: 0
        };
      }
    });

    penggantian.forEach(p => {
      const jLama = jenisMap.get(p.jenis_lama_id);
      const merk = jLama?.merk;
      if (merk && merkMap[merk]) {
        merkMap[merk].total_pergantian += 1;
        if (p.usia_hari != null && p.usia_hari > 0) {
          merkMap[merk].total_hari += p.usia_hari;
          merkMap[merk].data_hari_count += 1;
        }
        if (p.rusak_dini) merkMap[merk].rusak_dini += 1;
        if (p.alasan === 'dimainkan_santri' || p.alasan === 'hilang') merkMap[merk].dimainkan_santri += 1;
        if (p.alasan === 'habis_masa_pakai') merkMap[merk].putus_wajar += 1;
      }
    });

    return Object.values(merkMap).map(m => {
      const rataHari = m.data_hari_count > 0 ? Math.round(m.total_hari / m.data_hari_count) : 0;
      const persenDini = m.total_pergantian > 0 ? Math.round((m.rusak_dini / m.total_pergantian) * 100) : 0;
      return {
        ...m,
        rata_rata_hari: rataHari,
        persentase_rusak_dini: persenDini
      };
    }).sort((a, b) => b.rata_rata_hari - a.rata_rata_hari);
  }

  // Analisis Titik Rawan (Instan)
  async getEvaluasiTitikRawan() {
    const penggantian = this.memory.penggantian;
    const lokasiMap = new Map(this.memory.lokasi.map(l => [l.id, l]));
    const jenisMap = new Map(this.memory.jenis_lampu.map(j => [j.id, j]));
    const countMap = {};

    this.memory.fitting.forEach(f => {
      countMap[f.id] = {
        fitting: {
          ...f,
          lokasi: lokasiMap.get(f.lokasi_id) || null,
          jenis_lampu: jenisMap.get(f.jenis_lampu_id) || null
        },
        jumlah_rusak: 0,
        karena_santri: 0,
        riwayat: []
      };
    });

    penggantian.forEach(p => {
      if (countMap[p.fitting_id]) {
        countMap[p.fitting_id].jumlah_rusak += 1;
        if (p.alasan === 'dimainkan_santri' || p.alasan === 'hilang' || p.indikasi_santri) {
          countMap[p.fitting_id].karena_santri += 1;
        }
        countMap[p.fitting_id].riwayat.push(p);
      }
    });

    return Object.values(countMap)
      .filter(item => item.jumlah_rusak > 0)
      .sort((a, b) => b.jumlah_rusak - a.jumlah_rusak);
  }

  // Format Teks WhatsApp (Instan)
  async formatLaporanWA(tipe = 'lengkap') {
    const fitting = await this.getFitting();
    const penggantian = this.memory.penggantian;
    const stok = await this.getStokRingkasan();
    const evaluasiMerk = await this.getEvaluasiMerk();
    const titikRawan = await this.getEvaluasiTitikRawan();

    const totalFitting = fitting.length;
    const totalAktif = fitting.filter(f => f.status === 'aktif').length;
    const totalKosong = fitting.filter(f => f.status === 'kosong').length;

    const tglSekarang = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    const alasanSantri = penggantian.filter(p => p.alasan === 'dimainkan_santri' || p.alasan === 'hilang' || p.indikasi_santri).length;
    const alasanWajar = penggantian.filter(p => p.alasan === 'habis_masa_pakai').length;
    const alasanKonslet = penggantian.filter(p => p.alasan === 'konslet').length;

    let text = '';

    if (tipe === 'lengkap') {
      text = `📊 *LAPORAN EVALUASI & STOK LAMPU PESANTREN*
🏛️ *${CONFIG.NAMA_LEMBAGA}*
📅 *Waktu:* ${tglSekarang}
━━━━━━━━━━━━━━━━━━━━

💡 *1. STATUS TITIK LAMPU*
• Total Dudukan/Fitting : ${totalFitting} titik
• Lampu Menyala Aktif   : ${totalAktif} titik
• Fitting Kosong/Mati   : ${totalKosong} titik ${totalKosong > 0 ? '⚠️ (Perlu diganti)' : '✅'}

⚠️ *2. EVALUASI KERUSAKAN & KENAKALAN SANTRI*
• Total Kejadian Kerusakan : ${penggantian.length} kali
  - ⏳ Putus Wajar / Habis Umur : ${alasanWajar} kali
  - ⚽ Dimainkan Santri / Hilang : ${alasanSantri} kali ${alasanSantri > 0 ? '⚠️ *(Perlu Perhatian Khusus)*' : ''}
  - ⚡ Konslet / Tegangan Listrik : ${alasanKonslet} kali

🚨 *TOP TITIK RAWAN (Sering Rusak/Hilang):*
${titikRawan.slice(0, 3).map((r, i) => `${i + 1}. *${r.fitting.kode}* — ${labelLokasi(r.fitting.lokasi) || 'Tanpa Lokasi'} (${r.jumlah_rusak}x rusak, ${r.karena_santri}x ulah santri)`).join('\n') || '• Belum ada titik rawan signifikan'}

🏆 *3. EVALUASI MERK LAMPU (DAYA TAHAN)*
${evaluasiMerk.map(m => `• *${m.merk}*: Rata-rata ${m.rata_rata_hari} hari (${m.persentase_rusak_dini}% rusak dini)`).join('\n')}

📦 *4. SISA STOK GUDANG*
${stok.map(s => `• ${s.merk} ${s.jenis} ${s.watt ? s.watt + 'W' : ''} : *${s.sisa} pcs* ${s.status_stok === 'menipis' ? '⚠️ (Menipis)' : s.status_stok === 'habis' ? '❌ (HABIS)' : '✅'}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━
📌 *Rekomendasi:*
- Lakukan razia/pemberitahuan tata tertib asrama untuk area titik rawan.
- Gunakan cover pelindung fitting pada selasar dan kamar santri.
_Dibuat otomatis oleh Aplikasi Pantau Lampu_`;
    } else if (tipe === 'urgent') {
      const mati = fitting.filter(f => f.status === 'kosong');
      text = `🚨 *LAPORAN URGEN: LAMPU MATI/KOSONG*
🏛️ *${CONFIG.NAMA_LEMBAGA}*
📅 ${tglSekarang}

Daftar titik fitting yang membutuhkan penggantian segera:
${mati.length ? mati.map((f, i) => `${i + 1}. *${f.kode}* — ${labelLokasi(f.lokasi) || '-'} (${f.keterangan || 'Lampu mati'})`).join('\n') : '✅ Alhamdulillah seluruh titik lampu menyala aktif.'}

Mohon teknisi/petugas segera melakukan pemasangan baru.`;
    } else if (tipe === 'stok') {
      const menipis = stok.filter(s => s.status_stok !== 'aman');
      text = `📦 *LAPORAN KEBUTUHAN PENGADAAN LAMPU*
🏛️ *${CONFIG.NAMA_LEMBAGA}*
📅 ${tglSekarang}

Daftar stok lampu yang perlu segera dibeli/restock:
${menipis.length ? menipis.map((s, i) => `${i + 1}. *${s.merk} ${s.jenis} ${s.watt ? s.watt + 'W' : ''}* — Sisa: *${s.sisa} pcs* (${s.status_stok.toUpperCase()})`).join('\n') : '✅ Seluruh stok lampu di gudang masih dalam batas aman.'}

Dimohon untuk pengajuan ke bagian pengadaan.`;
    }

    return text;
  }
}

const DataStore = new DataStoreService();
