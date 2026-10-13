import { requireAdmin, logout } from "./lib/route-guard.js";
import { getJenisAntrian, getTiket, saveTiket } from "./storage.js";
function init() {
    const session = requireAdmin();
    if (!session)
        return;
    const namaUser = document.getElementById("nama-user");
    const btnLogout = document.getElementById("btn-logout");
    const pesanKosong = document.getElementById("pesan-kosong");
    const daftarKartu = document.getElementById("daftar-kartu");
    const bobotPrioritas = {
        VIP: 0,
        Disabilitas: 0,
        Lansia: 0,
        Normal: 1,
    };
    function tiketMenunggu(jenisId, semua) {
        return semua
            .filter((t) => t.jenisId === jenisId && t.status === "Menunggu")
            .sort((a, b) => bobotPrioritas[a.prioritas] - bobotPrioritas[b.prioritas] ||
            a.dibuatPada - b.dibuatPada ||
            a.nomor - b.nomor);
    }
    function tiketAktif(jenisId, semua) {
        return semua.find((t) => t.jenisId === jenisId && t.status === "Dipanggil");
    }
    function buatElemen(tag, kelas, teks = "") {
        const el = document.createElement(tag);
        el.className = kelas;
        el.textContent = teks;
        return el;
    }
    function buatKartu(j, semua) {
        const menunggu = tiketMenunggu(j.id, semua);
        const aktif = tiketAktif(j.id, semua);
        const berikutnya = menunggu[0];
        const kartu = document.createElement("article");
        kartu.className = j.aktif ? "kartu-jenis" : "kartu-jenis nonaktif";
        const header = buatElemen("div", "kartu-header");
        header.append(buatElemen("h2", "nama-jenis", j.aktif ? j.nama : `${j.nama} (nonaktif)`), buatElemen("span", "jumlah-menunggu", `${menunggu.length} menunggu`));
        const blokDipanggil = buatElemen("div", "blok-dipanggil");
        blokDipanggil.append(buatElemen("span", "label", "Sedang dipanggil"), buatElemen("strong", "nomor-dipanggil", aktif ? aktif.label : "-"));
        const blokBerikutnya = buatElemen("div", "blok-berikutnya");
        blokBerikutnya.append(buatElemen("span", "label", "Berikutnya"), buatElemen("strong", "nomor-berikutnya", berikutnya ? berikutnya.label : "-"), buatElemen("small", "prioritas-berikutnya", berikutnya ? `Prioritas ${berikutnya.prioritas}` : ""));
        const isi = buatElemen("div", "kartu-isi");
        isi.append(blokDipanggil, blokBerikutnya);
        const btnPanggil = buatElemen("button", "btn-panggil", "Panggil Berikutnya");
        btnPanggil.type = "button";
        btnPanggil.disabled = menunggu.length === 0;
        btnPanggil.addEventListener("click", () => panggilBerikutnya(j.id));
        const btnLewati = buatElemen("button", "btn-lewati", "Lewati");
        btnLewati.type = "button";
        btnLewati.disabled = !aktif;
        btnLewati.addEventListener("click", () => lewati(j.id));
        const btnSelesai = buatElemen("button", "btn-selesai", "Selesai");
        btnSelesai.type = "button";
        btnSelesai.disabled = !aktif;
        btnSelesai.addEventListener("click", () => selesai(j.id));
        const aksi = buatElemen("div", "kartu-aksi");
        aksi.append(btnPanggil, btnLewati, btnSelesai);
        const pesan = buatElemen("p", "pesan-kartu", menunggu.length === 0 ? "Tidak ada tiket menunggu untuk jenis antrian ini." : "");
        kartu.append(header, isi, aksi, pesan);
        return kartu;
    }
    function render() {
        daftarKartu.innerHTML = "";
        const jenisList = getJenisAntrian();
        const semua = getTiket();
        pesanKosong.hidden = jenisList.length > 0;
        for (const j of jenisList) {
            daftarKartu.appendChild(buatKartu(j, semua));
        }
    }
    function panggilBerikutnya(jenisId) {
        const semua = getTiket();
        const berikutnya = tiketMenunggu(jenisId, semua)[0];
        if (!berikutnya)
            return;
        const aktif = tiketAktif(jenisId, semua);
        if (aktif)
            aktif.status = "Selesai";
        berikutnya.status = "Dipanggil";
        berikutnya.dipanggilPada = Date.now();
        saveTiket(semua);
        render();
    }
    function lewati(jenisId) {
        const semua = getTiket();
        const aktif = tiketAktif(jenisId, semua);
        if (!aktif)
            return;
        aktif.status = "Dilewati";
        saveTiket(semua);
        render();
    }
    function selesai(jenisId) {
        const semua = getTiket();
        const aktif = tiketAktif(jenisId, semua);
        if (!aktif)
            return;
        aktif.status = "Selesai";
        saveTiket(semua);
        render();
    }
    namaUser.textContent = session.firstName;
    btnLogout.addEventListener("click", logout);
    window.addEventListener("storage", render);
    render();
}
init();
