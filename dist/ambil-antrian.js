import { requireAuth, logout } from "./lib/route-guard.js";
import { getJenisAntrian, buatTiket } from "./storage.js";
const DAFTAR_PRIORITAS = [
    "Normal",
    "Lansia",
    "Disabilitas",
    "VIP"
];
const pilihanJenis = document.querySelector("#jenis-antrian");
const pilihanPrioritas = document.querySelector("#prioritas");
const tombolAmbil = document.querySelector("#ambil-btn");
const hasilAntrian = document.querySelector("#hasil-antrian");
const tombolLogout = document.querySelector("#btn-logout");
function adalahPrioritas(nilai) {
    return DAFTAR_PRIORITAS.includes(nilai);
}
let dataJenisSebelumnya = "";
function tampilkanJenisAntrian() {
    if (!pilihanJenis)
        return;
    const daftarJenis = getJenisAntrian().filter((jenis) => jenis.aktif);
    const dataJenisTerbaru = JSON.stringify(daftarJenis);
    if (dataJenisTerbaru === dataJenisSebelumnya) {
        return;
    }
    const pilihanSebelumnya = pilihanJenis.value;
    dataJenisSebelumnya = dataJenisTerbaru;
    pilihanJenis.innerHTML = "";
    pilihanJenis.add(new Option(daftarJenis.length === 0
        ? "Belum ada jenis layanan aktif"
        : "Pilih jenis layanan", ""));
    daftarJenis.forEach((jenis) => {
        pilihanJenis.add(new Option(`${jenis.nama} (${jenis.kode})`, jenis.id));
    });
    if (daftarJenis.some((jenis) => jenis.id === pilihanSebelumnya)) {
        pilihanJenis.value = pilihanSebelumnya;
    }
}
function ambilAntrian() {
    if (!pilihanJenis || !pilihanPrioritas || !hasilAntrian) {
        return;
    }
    const jenisTerpilih = getJenisAntrian().find((jenis) => jenis.id === pilihanJenis.value && jenis.aktif);
    if (!jenisTerpilih) {
        hasilAntrian.textContent =
            "Silakan pilih jenis layanan yang masih aktif.";
        return;
    }
    const prioritas = pilihanPrioritas.value;
    if (!adalahPrioritas(prioritas)) {
        hasilAntrian.textContent =
            "Prioritas antrian tidak valid.";
        return;
    }
    const tiket = buatTiket(jenisTerpilih, prioritas);
    hasilAntrian.textContent =
        `Nomor antrian: ${tiket.label} | ` +
            `Layanan: ${jenisTerpilih.nama} | ` +
            `Prioritas: ${tiket.prioritas}`;
}
const session = requireAuth();
if (session !== null) {
    tampilkanJenisAntrian();
    window.setInterval(tampilkanJenisAntrian, 2000);
    tombolAmbil?.addEventListener("click", ambilAntrian);
    tombolLogout?.addEventListener("click", logout);
}
