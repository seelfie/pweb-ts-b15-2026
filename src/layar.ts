import { requireAuth, logout } from "./lib/route-guard.js";
import { getJenisAntrian, getTiket } from "./storage.js";

const daftarLayanan = document.querySelector<HTMLDivElement>(
    "#daftar-layanan"
);

const tombolFullscreen = document.querySelector<HTMLButtonElement>(
    "#fullscreen-btn"
);

const tombolLogout = document.querySelector<HTMLButtonElement>(
    "#btn-logout"
);

function tampilkanLayarAntrian(): void {
    if (!daftarLayanan) return;

    const jenisLayanan = getJenisAntrian().filter(
        (jenis) => jenis.aktif
    );

    const semuaTiket = getTiket();

    if (jenisLayanan.length === 0) {
        daftarLayanan.innerHTML =
            "<p>Belum ada jenis layanan yang tersedia.</p>";
        return;
    }

    daftarLayanan.innerHTML = "";

    jenisLayanan.forEach((jenis) => {
        const tiketLayanan = semuaTiket.filter(
            (tiket) => tiket.jenisId === jenis.id
        );

        const tiketDipanggil = tiketLayanan.find(
            (tiket) => tiket.status === "Dipanggil"
        );

        const jumlahMenunggu = tiketLayanan.filter(
            (tiket) => tiket.status === "Menunggu"
        ).length;

        const kartu = document.createElement("article");
        kartu.className = "kartu-antrian";

        const judul = document.createElement("h2");
        judul.textContent = jenis.nama;

        const nomor = document.createElement("div");
        nomor.className = "nomor-dipanggil";
        nomor.textContent = tiketDipanggil
            ? tiketDipanggil.label
            : "---";

        const sisa = document.createElement("p");
        sisa.className = "sisa-antrian";
        sisa.textContent = `Sisa antrian: ${jumlahMenunggu}`;

        kartu.append(judul, nomor, sisa);
        daftarLayanan.appendChild(kartu);
    });
}

async function toggleFullscreen(): Promise<void> {
    if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
    } else {
        await document.exitFullscreen();
    }
}

const session = requireAuth();

if (session !== null) {
    tombolLogout?.addEventListener("click", logout);

    tombolFullscreen?.addEventListener("click", () => {
        void toggleFullscreen();
    });

    tampilkanLayarAntrian();
    window.setInterval(tampilkanLayarAntrian, 2000);

    window.addEventListener("storage", tampilkanLayarAntrian);
}