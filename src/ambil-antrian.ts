import { requireAuth, logout } from "./lib/route-guard.js";
import { getJenisAntrian, buatTiket } from "./storage.js";
import type { JenisAntrian, Prioritas } from "./types/antrian.js";

const DAFTAR_PRIORITAS: Prioritas[] = [
    "Normal",
    "Lansia",
    "Disabilitas",
    "VIP"
];

const pilihanJenis = document.querySelector<HTMLSelectElement>(
    "#jenis-antrian"
);
const pilihanPrioritas = document.querySelector<HTMLSelectElement>(
    "#prioritas"
);
const tombolAmbil = document.querySelector<HTMLButtonElement>(
    "#ambil-btn"
);
const hasilAntrian = document.querySelector<HTMLDivElement>(
    "#hasil-antrian"
);
const tombolLogout =
    document.querySelector<HTMLButtonElement>("#btn-logout");

function adalahPrioritas(nilai: string): nilai is Prioritas {
    return (DAFTAR_PRIORITAS as string[]).includes(nilai);
}

let dataJenisSebelumnya = "";

function tampilkanJenisAntrian(): void {
    if (!pilihanJenis) return;

    const daftarJenis = getJenisAntrian().filter(
        (jenis) => jenis.aktif
    );

    const dataJenisTerbaru = JSON.stringify(daftarJenis);

    if (dataJenisTerbaru === dataJenisSebelumnya) {
        return;
    }

    const pilihanSebelumnya = pilihanJenis.value;
    dataJenisSebelumnya = dataJenisTerbaru;

    pilihanJenis.innerHTML = "";

    pilihanJenis.add(
        new Option(
            daftarJenis.length === 0
                ? "Belum ada jenis layanan aktif"
                : "Pilih jenis layanan",
            ""
        )
    );

    daftarJenis.forEach((jenis) => {
        pilihanJenis.add(
            new Option(`${jenis.nama} (${jenis.kode})`, jenis.id)
        );
    });

    if (
        daftarJenis.some(
            (jenis) => jenis.id === pilihanSebelumnya
        )
    ) {
        pilihanJenis.value = pilihanSebelumnya;
    }
}

function ambilAntrian(): void {
    if (!pilihanJenis || !pilihanPrioritas || !hasilAntrian) {
        return;
    }

    const jenisTerpilih = getJenisAntrian().find(
        (jenis) =>
            jenis.id === pilihanJenis.value && jenis.aktif
    );

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
