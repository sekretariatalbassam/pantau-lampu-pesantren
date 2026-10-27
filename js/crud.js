/* ============================================================
   Pembantu Form & CRUD Generik Mobile First (Lokasi & Jenis Lampu)
   ============================================================ */

function fieldHtml(f, nilai) {
  const v = nilai ?? f.default ?? '';
  const id = 'f_' + f.key;
  const req = f.required ? 'required' : '';
  let input;

  if (f.type === 'textarea') {
    input = `<textarea id="${id}" name="${f.key}" rows="2" ${req}>${esc(v)}</textarea>`;
  } else if (f.type === 'select') {
    const opsi = (f.options || []).map((o) =>
      `<option value="${esc(o.value)}" ${String(o.value) === String(v) ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
    input = `<select id="${id}" name="${f.key}" ${req}><option value="">${esc(f.kosong || '— pilih —')}</option>${opsi}</select>`;
  } else {
    const saran = f.saran
      ? `<datalist id="${id}_list">${f.saran.map((s) => `<option value="${esc(s)}">`).join('')}</datalist>` : '';
    input = `<input id="${id}" name="${f.key}" type="${f.type || 'text'}" value="${esc(v)}"
      ${f.type === 'number' ? 'inputmode="numeric"' : ''} ${f.min != null ? `min="${f.min}"` : ''}
      ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ''} ${f.saran ? `list="${id}_list"` : ''} ${req}>${saran}`;
  }
  return `<label class="field"><span>${esc(f.label)}${f.required ? ' *' : ''}</span>${input}${f.bantuan ? `<small>${esc(f.bantuan)}</small>` : ''}</label>`;
}

function bacaForm(form, fields) {
  const fd = new FormData(form);
  const hasil = {};
  for (const f of fields) {
    const mentah = fd.get(f.key);
    const v = mentah === null ? '' : String(mentah).trim();
    if (v === '') hasil[f.key] = null;
    else if (f.type === 'number' || f.angka) hasil[f.key] = Number(v);
    else hasil[f.key] = v;
  }
  return hasil;
}

function buatHalamanCrud(cfg) {
  return async function (el) {
    let rows = [];
    let editId = null;

    el.innerHTML = `
      <div class="page-head">
        <div>
          <h2>${esc(cfg.judul)}</h2>
          ${cfg.bantuan ? `<p class="muted text-sm">${cfg.bantuan}</p>` : ''}
        </div>
        <button class="btn primary small" id="btn-tambah" type="button">+ Tambah</button>
      </div>
      <div id="form-box"></div>
      <div id="daftar"></div>`;

    const formBox = $('#form-box', el);
    const daftar = $('#daftar', el);

    async function muat() {
      if (DataStore.isSupabaseLive()) {
        try {
          let q = App.db.from(cfg.table).select('*');
          for (const k of cfg.urut) q = q.order(k, { ascending: true });
          const { data, error } = await DataStore.withTimeout(q);
          if (!error && data) {
            rows = data;
            gambar();
            return;
          }
        } catch (e) {}
      }

      rows = [...(DataStore.memory[cfg.table] || [])];
      rows.sort((a, b) => {
        for (const k of cfg.urut) {
          const valA = String(a[k] || '');
          const valB = String(b[k] || '');
          const comp = valA.localeCompare(valB);
          if (comp !== 0) return comp;
        }
        return 0;
      });
      gambar();
    }

    function gambar() {
      if (!rows.length) {
        daftar.innerHTML = `<div class="card kosong-info">Belum ada data. Tekan <b>+ Tambah</b> untuk mengisi.</div>`;
        return;
      }

      // Tampilan Card List ramah layar HP
      const cardItems = rows.map((r) => `
        <div class="mcard-item">
          <div class="mcard-head">
            <b>${esc(cfg.kolom[0].fmt ? cfg.kolom[0].fmt(r) : r[cfg.kolom[0].key])}</b>
            <div class="row-btn">
              <button class="btn small" data-aksi="ubah" data-id="${r.id}" type="button">Ubah</button>
              <button class="btn small danger" data-aksi="hapus" data-id="${r.id}" type="button">Hapus</button>
            </div>
          </div>
          <div class="mcard-body">
            ${cfg.kolom.slice(1).map(k => `
              <div style="font-size:0.85rem;color:#475569;margin-top:2px;">
                <span style="color:#94a3b8;font-size:0.75rem;text-transform:uppercase;">${esc(k.label)}:</span>
                <b>${esc(k.fmt ? k.fmt(r) : r[k.key] || '-')}</b>
              </div>`).join('')}
          </div>
        </div>
      `).join('');

      daftar.innerHTML = `
        <div class="mobile-card-list">${cardItems}</div>
        <p class="muted text-sm text-center">${rows.length} data tersimpan</p>
      `;
    }

    function tampilForm(row) {
      editId = row ? row.id : null;
      formBox.innerHTML = `<form class="card form" id="f-crud">
        <h3>${row ? 'Ubah' : 'Tambah'} ${esc(cfg.tunggal)}</h3>
        ${cfg.fields.map((f) => fieldHtml(f, row ? row[f.key] : undefined)).join('')}
        <div class="row-btn mt-3">
          <button class="btn primary block" type="submit">Simpan</button>
          <button class="btn block" type="button" id="btn-batal">Batal</button>
        </div></form>`;

      $('#btn-batal', formBox).onclick = () => { formBox.innerHTML = ''; };

      $('#f-crud', formBox).onsubmit = async (e) => {
        e.preventDefault();
        const payload = bacaForm(e.target, cfg.fields);

        if (editId) {
          const idx = DataStore.memory[cfg.table].findIndex(item => item.id === editId);
          if (idx >= 0) {
            DataStore.memory[cfg.table][idx] = { ...DataStore.memory[cfg.table][idx], ...payload };
          }
          if (DataStore.isSupabaseLive()) {
            App.db.from(cfg.table).update(payload).eq('id', editId).catch(() => {});
          }
          toast(`${cfg.tunggal} berhasil diperbarui.`);
        } else {
          payload.id = Date.now();
          DataStore.memory[cfg.table].push(payload);
          if (DataStore.isSupabaseLive()) {
            App.db.from(cfg.table).insert([payload]).catch(() => {});
          }
          toast(`${cfg.tunggal} berhasil ditambahkan.`);
        }

        DataStore.persist();
        formBox.innerHTML = '';
        await muat();
      };

      formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    daftar.onclick = async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const aksi = btn.dataset.aksi;
      const row = rows.find((r) => r.id === id);

      if (aksi === 'ubah') {
        tampilForm(row);
      } else if (aksi === 'hapus') {
        const info = cfg.ringkas ? cfg.ringkas(row) : `id ${id}`;
        if (!confirm(`Hapus ${cfg.tunggal} "${info}"?\n${cfg.peringatanHapus || ''}`)) return;

        DataStore.memory[cfg.table] = DataStore.memory[cfg.table].filter(r => r.id !== id);
        DataStore.persist();

        if (DataStore.isSupabaseLive()) {
          App.db.from(cfg.table).delete().eq('id', id).catch(() => {});
        }

        toast(`${cfg.tunggal} telah dihapus.`);
        await muat();
      }
    };

    $('#btn-tambah', el).onclick = () => tampilForm(null);
    await muat();
  };
}
