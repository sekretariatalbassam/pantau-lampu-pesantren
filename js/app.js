/* ============================================================
   Pantau Lampu Pesantren - Inti Aplikasi & Router Mobile First
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const labelLokasi = (l) => l ? [l.gedung, l.lantai && 'Lt. ' + l.lantai, l.ruang].filter(Boolean).join(' › ') : '';
const labelJenis = (j) => j ? [j.merk, j.jenis, j.watt ? j.watt + 'W' : ''].filter(Boolean).join(' ') : '';
const fmtTanggal = (d) => d
  ? new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  : '-';

const kodeDariNomor = (n) => 'F-' + String(n).padStart(3, '0');
const nomorKode = (kode) => parseInt(String(kode).replace(/\D/g, ''), 10) || 0;
const urutKode = (a, b) => nomorKode(a.kode) - nomorKode(b.kode);

// Umpan Balik Getar Sentuhan Mobile (Micro-Haptic Feedback)
function hapticTap(pola = 12) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pola); } catch (e) {}
  }
}

// Suara Beep Scanner
function bunyiBeep(tipe = 'ok') {
  hapticTap(tipe === 'ok' ? [30, 40, 50] : [50, 50, 50]);
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = tipe === 'ok' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(tipe === 'ok' ? 920 : 440, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) {}
}

let toastTimer;
function toast(pesan, tipe = 'ok') {
  hapticTap(tipe === 'err' ? [30, 50, 30] : 15);
  const t = $('#toast');
  if (!t) return;
  t.textContent = pesan;
  t.className = 'show ' + (tipe === 'err' ? 'err' : tipe === 'warn' ? 'warn' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ''; }, tipe === 'err' ? 6000 : 3500);
}

// Global modal helper (Bottom Sheet Style di HP)
function bukaModal(judul, kontenHtml) {
  let modalWrap = $('#modal-wrap');
  if (!modalWrap) {
    modalWrap = document.createElement('div');
    modalWrap.id = 'modal-wrap';
    modalWrap.className = 'modal-backdrop';
    document.body.appendChild(modalWrap);
  }
  modalWrap.innerHTML = `
    <div class="modal-card">
      <div class="modal-handle-bar"></div>
      <div class="modal-header">
        <h3>${esc(judul)}</h3>
        <button class="btn-close" id="modal-close" type="button">&times;</button>
      </div>
      <div class="modal-body">${kontenHtml}</div>
    </div>`;
  modalWrap.classList.add('active');
  $('#modal-close', modalWrap).onclick = tutupModal;
  modalWrap.onclick = (e) => {
    if (e.target === modalWrap) tutupModal();
  };
}

function tutupModal() {
  const modalWrap = $('#modal-wrap');
  if (modalWrap && modalWrap.classList) modalWrap.classList.remove('active');
}

// Drawer Bottom Sheet (Menu Lainnya)
function bukaDrawer() {
  const drawer = $('#menu-drawer-backdrop');
  if (drawer && drawer.classList) {
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('open'));
  }
}

function tutupDrawer() {
  const drawer = $('#menu-drawer-backdrop');
  if (drawer && drawer.classList) {
    drawer.classList.remove('open');
    setTimeout(() => { drawer.hidden = true; }, 250);
  }
}

// ----- Status Aplikasi -----
const App = {
  db: null,
  user: null,
  profil: null,
  isDemo: false,
  isAdmin() { return true; }
};

const Pages = {};

async function route() {
  if (!App.user && !App.isDemo) return;
  tutupDrawer();
  tutupModal();

  let hashParts = location.hash.replace(/^#\/?/, '').split('?');
  let nama = hashParts[0] || 'beranda';
  let query = new URLSearchParams(hashParts[1] || '');

  if (!Pages[nama]) nama = 'beranda';

  // Update active state di Desktop Nav & Bottom Nav
  $$('.desktop-nav a').forEach((el) => {
    el.classList.toggle('active', el.dataset.page === nama);
  });
  $$('#bottom-nav [data-page]').forEach((el) => {
    el.classList.toggle('active', el.dataset.page === nama);
  });

  const el = $('#page');
  if (!el) return;

  if (!Pages[nama]) {
    el.innerHTML = '<div class="loading-state"><div class="spinner"></div><p class="muted">Menyiapkan halaman…</p></div>';
    setTimeout(route, 150);
    return;
  }

  el.innerHTML = '<div class="loading-state"><div class="spinner"></div><p class="muted">Memuat data…</p></div>';
  window.scrollTo(0, 0);

  try {
    await Pages[nama](el, query);
  } catch (e) {
    console.error(e);
    el.innerHTML = `<div class="card error"><strong>Terjadi kesalahan saat memuat:</strong><br>${esc(e.message || e)}</div>`;
  }
}

function tampilLogin() {
  App.user = null;
  App.isDemo = false;
  try { localStorage.removeItem('PANTAU_LAMPU_LOGGED_IN'); } catch (e) {}
  const appView = $('#app-view');
  const loginView = $('#login-view');
  if (appView) appView.hidden = true;
  if (loginView) loginView.hidden = false;
  const pwd = $('#login-password');
  if (pwd) pwd.value = '';
}

async function masuk(user, isDemoMode = false) {
  App.user = user || { email: 'pengurus@pesantren.id' };
  App.isDemo = isDemoMode;
  try {
    localStorage.setItem('PANTAU_LAMPU_LOGGED_IN', isDemoMode ? 'demo' : 'supabase');
  } catch (e) {}

  App.profil = {
    nama: isDemoMode ? 'Pengurus Pesantren' : (user && user.email ? user.email.split('@')[0] : 'Petugas'),
    peran: 'admin'
  };

  const namaUserEl = $('#nama-user');
  if (namaUserEl) {
    namaUserEl.textContent = isDemoMode ? '👤 Pengurus' : App.profil.nama;
  }

  const loginView = $('#login-view');
  const appView = $('#app-view');
  if (loginView) loginView.hidden = true;
  if (appView) appView.hidden = false;

  if (!location.hash) {
    location.hash = '#/beranda';
  } else {
    route();
  }
}

async function init() {
  try {
    document.title = `${CONFIG.NAMA_APLIKASI} — ${CONFIG.NAMA_LEMBAGA}`;
    const lj = $('#login-judul'); if (lj) lj.textContent = CONFIG.NAMA_APLIKASI;
    const ll = $('#login-lembaga'); if (ll) ll.textContent = CONFIG.NAMA_LEMBAGA;
    const bn = $('#brand-nama'); if (bn) bn.textContent = CONFIG.NAMA_APLIKASI;
    const bl = $('#brand-lembaga'); if (bl) bl.textContent = CONFIG.NAMA_LEMBAGA;

    // Tombol Demo / Masuk Cepat Siap Pakai
    const demoBtn = $('#btn-demo-mode');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        masuk({ email: 'pengurus@albassam.id' }, true);
        toast('Selamat datang di Aplikasi Pantau Lampu Pesantren!');
      });
    }

    // Drawer Menu Handlers
    const btnMenuDrawer = $('#btn-menu-drawer');
    if (btnMenuDrawer) btnMenuDrawer.onclick = bukaDrawer;

    const btnCloseDrawer = $('#btn-close-drawer');
    if (btnCloseDrawer) btnCloseDrawer.onclick = tutupDrawer;

    const drawerBackdrop = $('#menu-drawer-backdrop');
    if (drawerBackdrop) {
      drawerBackdrop.onclick = (e) => {
        if (e.target === drawerBackdrop) tutupDrawer();
      };
    }
    $$('#menu-drawer-backdrop a').forEach(a => {
      a.onclick = () => tutupDrawer();
    });

    const btnDrawerReset = $('#btn-drawer-reset');
    if (btnDrawerReset) {
      btnDrawerReset.onclick = () => {
        tutupDrawer();
        bukaModal('Konfirmasi Bersihkan Data', `
          <p>Tindakan ini akan mengosongkan seluruh data <b>Titik Fitting</b>, <b>Riwayat Penggantian</b>, dan <b>Mutasi Stok</b> agar Anda bisa memulai dari nol dengan data nyata.</p>
          <p class="text-sm muted" style="margin-top:6px;">Master Lokasi dan Jenis Lampu tidak akan dihapus.</p>
          <div class="row-btn mt-3">
            <button class="btn danger block" id="btn-konfirmasi-reset" type="button">🗑️ Ya, Bersihkan Semua Data</button>
            <button class="btn block" id="btn-batal-reset" type="button">Batal</button>
          </div>
        `);
        $('#btn-konfirmasi-reset').onclick = () => {
          DataStore.resetDataTransaksi();
          tutupModal();
          toast('Seluruh data transaksi berhasil dibersihkan! Aplikasi siap dari nol.');
          route();
        };
        $('#btn-batal-reset').onclick = tutupModal;
      };
    }

    // Supabase Connect bila kredensial tersedia
    const punyaKredensial = CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL.trim() !== '' &&
                            !CONFIG.SUPABASE_URL.startsWith('ISI_') &&
                            CONFIG.SUPABASE_ANON_KEY && CONFIG.SUPABASE_ANON_KEY.trim() !== '' &&
                            !CONFIG.SUPABASE_ANON_KEY.startsWith('ISI_');

    if (punyaKredensial && window.supabase) {
      try {
        App.db = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
      } catch (e) {
        console.warn('Inisialisasi Supabase gagal:', e);
      }
    }

    // Form Login
    const loginForm = $('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = $('#login-btn'), err = $('#login-error');
        if (err) err.hidden = true;

        if (!App.db) {
          if (err) {
            err.textContent = 'Koneksi Supabase belum aktif. Silakan gunakan Mode Simulasi Pesantren di bawah.';
            err.hidden = false;
          }
          return;
        }

        if (btn) { btn.disabled = true; btn.textContent = 'Memeriksa…'; }

        try {
          const emailInput = $('#login-email');
          const pwdInput = $('#login-password');
          const { data, error } = await App.db.auth.signInWithPassword({
            email: emailInput ? emailInput.value.trim() : '',
            password: pwdInput ? pwdInput.value : '',
          });
          if (btn) { btn.disabled = false; btn.textContent = 'Masuk Akun'; }

          if (error) {
            if (err) {
              err.textContent = 'Email atau password salah.';
              err.hidden = false;
            }
            return;
          }
          masuk(data.user, false);
        } catch (ex) {
          if (btn) { btn.disabled = false; btn.textContent = 'Masuk Akun'; }
          if (err) {
            err.textContent = 'Gagal terhubung. Gunakan Mode Simulasi Pesantren.';
            err.hidden = false;
          }
        }
      });
    }

    const btnKeluar = $('#btn-keluar');
    if (btnKeluar) {
      btnKeluar.addEventListener('click', async () => {
        if (App.db) {
          try { await App.db.auth.signOut(); } catch(e) {}
        }
        tampilLogin();
      });
    }

    window.addEventListener('hashchange', route);

    // Global Micro-Haptic Touch Feedback di Layar HP
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn, .bnav-item, .chip, .drawer-item, .mcard-item, #btn-demo-mode, .stat-card')) {
        hapticTap(10);
      }
    }, { passive: true });

    // Langsung buka aplikasi dalam mode demo pesantren (instan & siap pakai)
    let previousAuth = null;
    try { previousAuth = localStorage.getItem('PANTAU_LAMPU_LOGGED_IN'); } catch (e) {}

    if (previousAuth === 'supabase' && App.db) {
      try {
        const { data: { session } } = await App.db.auth.getSession();
        if (session) {
          await masuk(session.user, false);
          return;
        }
      } catch (e) {}
      tampilLogin();
    } else {
      // Default: Masuk ke Mode Demo Pesantren (Super Cepat)
      await masuk({ email: 'ustadz@albassam.id' }, true);
    }
  } catch (err) {
    console.error('Fatal initialization error:', err);
    // Fallback: buka halaman jika terjadi error tak terduga
    const appView = $('#app-view');
    const loginView = $('#login-view');
    if (loginView) loginView.hidden = true;
    if (appView) appView.hidden = false;
  }
}
