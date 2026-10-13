import { requireAdmin, logout } from "./lib/route-guard.js";
import { getJenisAntrian, saveJenisAntrian, getTiket, saveTiket, getCounter, saveCounter, buatTiket, resetAntrian, } from "./storage.js";
function init() {
    const session = requireAdmin();
    if (!session)
        return;
    const namaUser = document.getElementById("nama-user");
    const roleUser = document.getElementById("role-user");
    const btnReset = document.getElementById("btn-reset");
    const btnLogout = document.getElementById("btn-logout");
    const formJenis = document.getElementById("form-jenis");
    const inputKode = document.getElementById("input-kode");
    const inputNama = document.getElementById("input-nama");
    const pesanJenis = document.getElementById("pesan-jenis");
    const daftarJenis = document.getElementById("daftar-jenis");
    const formTiket = document.getElementById("form-tiket");
    const selectJenis = document.getElementById("select-jenis");
    const selectPrioritas = document.getElementById("select-prioritas");
    const pesanTiket = document.getElementById("pesan-tiket");
    const daftarTiket = document.getElementById("daftar-tiket");
    function tampilPesan(el, teks, error = true) {
        el.textContent = teks;
        el.className = error ? "pesan error" : "pesan sukses";
    }
    function buatItemJenis(j, menunggu) {
        const li = document.createElement("li");
        li.className = j.aktif ? "item-jenis" : "item-jenis nonaktif";
        const info = document.createElement("div");
        info.className = "info-jenis";
        const nama = document.createElement("span");
        nama.className = "nama-jenis";
        nama.textContent = j.nama;
        const kode = document.createElement("span");
        kode.className = "kode-jenis";
        kode.textContent = `(${j.kode})`;
        const jumlah = document.createElement("small");
        jumlah.className = "jumlah-menunggu";
        jumlah.textContent = `${menunggu} menunggu`;
        info.append(nama, kode, jumlah);
        const aksi = document.createElement("div");
        aksi.className = "aksi-jenis";
        const btnToggle = document.createElement("button");
        btnToggle.type = "button";
        btnToggle.className = "btn-toggle";
        btnToggle.textContent = j.aktif ? "Nonaktifkan" : "Aktifkan";
        btnToggle.addEventListener("click", () => toggleJenis(j.id));
        const btnHapus = document.createElement("button");
        btnHapus.type = "button";
        btnHapus.className = "btn-hapus";
        btnHapus.textContent = "Hapus";
        btnHapus.addEventListener("click", () => hapusJenis(j.id));
        aksi.append(btnToggle, btnHapus);
        li.append(info, aksi);
        return li;
    }
    function renderJenis() {
        daftarJenis.innerHTML = "";
        const jenisList = getJenisAntrian();
        const semuaTiket = getTiket();
        if (jenisList.length === 0) {
            const kosong = document.createElement("li");
            kosong.textContent = "Belum ada jenis antrian.";
            daftarJenis.appendChild(kosong);
            return;
        }
        for (const j of jenisList) {
            const menunggu = semuaTiket.filter((t) => t.jenisId === j.id && t.status === "Menunggu").length;
            daftarJenis.appendChild(buatItemJenis(j, menunggu));
        }
    }
    function renderSelectJenis() {
        const pilihanLama = selectJenis.value;
        selectJenis.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Pilih jenis antrian";
        selectJenis.appendChild(placeholder);
        for (const j of getJenisAntrian().filter((x) => x.aktif)) {
            const opt = document.createElement("option");
            opt.value = j.id;
            opt.textContent = `${j.nama} (${j.kode})`;
            selectJenis.appendChild(opt);
        }
        selectJenis.value = pilihanLama;
    }
    function renderTiket() {
        daftarTiket.innerHTML = "";
        const semuaTiket = getTiket();
        let adaTiket = false;
        for (const j of getJenisAntrian()) {
            const tiketJenis = semuaTiket
                .filter((t) => t.jenisId === j.id)
                .sort((a, b) => b.nomor - a.nomor);
            if (tiketJenis.length === 0)
                continue;
            adaTiket = true;
            const grup = document.createElement("div");
            grup.className = "grup-tiket";
            const judul = document.createElement("h3");
            judul.className = "judul-grup";
            judul.textContent = j.nama;
            const ul = document.createElement("ul");
            for (const t of tiketJenis) {
                const li = document.createElement("li");
                li.className = "item-tiket";
                const label = document.createElement("span");
                label.className = "label-tiket";
                label.textContent = t.label;
                const prioritas = document.createElement("span");
                prioritas.className = `badge-prioritas prioritas-${t.prioritas.toLowerCase()}`;
                prioritas.textContent = t.prioritas;
                const status = document.createElement("span");
                status.className = `badge-status status-${t.status.toLowerCase()}`;
                status.textContent = t.status;
                li.append(label, prioritas, status);
                ul.appendChild(li);
            }
            grup.append(judul, ul);
            daftarTiket.appendChild(grup);
        }
        if (!adaTiket) {
            const kosong = document.createElement("p");
            kosong.textContent = "Belum ada tiket.";
            daftarTiket.appendChild(kosong);
        }
    }
    function renderSemua() {
        renderJenis();
        renderSelectJenis();
        renderTiket();
    }
    function tambahJenis() {
        const kode = inputKode.value.trim().toUpperCase();
        const nama = inputNama.value.trim();
        if (!/^[A-Z]$/.test(kode)) {
            tampilPesan(pesanJenis, "Kode harus 1 huruf A-Z.");
            return;
        }
        if (nama === "") {
            tampilPesan(pesanJenis, "Nama layanan wajib diisi.");
            return;
        }
        const daftar = getJenisAntrian();
        const kembar = daftar.some((j) => j.kode.toUpperCase() === kode ||
            j.nama.toLowerCase() === nama.toLowerCase());
        if (kembar) {
            tampilPesan(pesanJenis, "Kode atau nama sudah dipakai.");
            return;
        }
        daftar.push({ id: `jenis-${Date.now()}`, kode, nama, aktif: true });
        saveJenisAntrian(daftar);
        formJenis.reset();
        tampilPesan(pesanJenis, `Jenis antrian "${nama}" ditambahkan.`, false);
        renderSemua();
    }
    function toggleJenis(id) {
        const daftar = getJenisAntrian();
        const j = daftar.find((x) => x.id === id);
        if (!j)
            return;
        j.aktif = !j.aktif;
        saveJenisAntrian(daftar);
        renderSemua();
    }
    function hapusJenis(id) {
        const j = getJenisAntrian().find((x) => x.id === id);
        if (!j)
            return;
        if (!confirm(`Hapus jenis antrian "${j.nama}" beserta seluruh tiketnya?`))
            return;
        saveJenisAntrian(getJenisAntrian().filter((x) => x.id !== id));
        saveTiket(getTiket().filter((t) => t.jenisId !== id));
        const counter = getCounter();
        delete counter[j.kode];
        saveCounter(counter);
        renderSemua();
    }
    function terbitkanTiket() {
        if (selectJenis.value === "") {
            tampilPesan(pesanTiket, "Pilih jenis antrian terlebih dahulu.");
            return;
        }
        const jenis = getJenisAntrian().find((j) => j.id === selectJenis.value);
        if (!jenis || !jenis.aktif) {
            tampilPesan(pesanTiket, "Jenis antrian tidak tersedia.");
            return;
        }
        const prioritas = selectPrioritas.value;
        const tiket = buatTiket(jenis, prioritas);
        tampilPesan(pesanTiket, `Tiket ${tiket.label} berhasil diterbitkan.`, false);
        renderSemua();
    }
    function resetSemuaAntrian() {
        if (!confirm("Kosongkan semua antrian dan mulai penomoran dari awal?"))
            return;
        resetAntrian();
        renderSemua();
    }
    namaUser.textContent = session.firstName;
    roleUser.textContent = session.role;
    formJenis.addEventListener("submit", (e) => {
        e.preventDefault();
        tambahJenis();
    });
    formTiket.addEventListener("submit", (e) => {
        e.preventDefault();
        terbitkanTiket();
    });
    btnReset.addEventListener("click", resetSemuaAntrian);
    btnLogout.addEventListener("click", logout);
    window.addEventListener("storage", renderSemua);
    renderSemua();
}
init();
