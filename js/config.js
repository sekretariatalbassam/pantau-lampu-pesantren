/* ============================================================
   PENGATURAN APLIKASI PANTAU LAMPU PESANTREN
   ============================================================ */
const CONFIG = {
  // Masukkan URL & Anon Key Supabase Anda HANYA jika project Supabase Anda sudah dibuat & aktif.
  // Biarkan kosong ("") bila ingin menggunakan Mode Lokal/Simulasi (Instan, super cepat, tanpa jeda loading).
  SUPABASE_URL: "https://dckogspjlskdmaejgpso.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja29nc3BqbHNrZG1hZWpncHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMDY0MjMsImV4cCI6MjEwODY4MjQyM30.XPV6JiH1rlNISGmF9QjOzd4AMWh9LirfggdfB3GdIv4",

  NAMA_APLIKASI: "Pantau Lampu Pesantren",
  NAMA_LEMBAGA: "Pesantren Tahfizh Al-Bassam",

  // Preset Label A4 12 Kotak (3 kolom x 4 baris)
  LABEL_A4_12: {
    kolom: 3,
    baris: 4,
    perHalaman: 12,
    lebarMm: 65,
    tinggiMm: 68,
    marginKertasMm: 7.5,
    jarakAntarMm: 2.5
  }
};
