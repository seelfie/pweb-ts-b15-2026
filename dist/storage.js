function bacaData(key, bawaan) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : bawaan;
    }
    catch {
        return bawaan;
    }
}
function simpanData(key, nilai) {
    localStorage.setItem(key, JSON.stringify(nilai));
}
export function getJenisAntrian() {
    return bacaData("jenisAntrian", []);
}
export function saveJenisAntrian(data) {
    simpanData("jenisAntrian", data);
}
export function getTiket() {
    return bacaData("tiket", []);
}
export function saveTiket(data) {
    simpanData("tiket", data);
}
export function getCounter() {
    return bacaData("counter", {});
}
export function saveCounter(data) {
    simpanData("counter", data);
}
export function buatTiket(jenis, prioritas) {
    const counter = getCounter();
    const nomor = (counter[jenis.kode] ?? 0) + 1;
    counter[jenis.kode] = nomor;
    saveCounter(counter);
    const tiket = {
        id: `tiket-${Date.now()}-${nomor}`,
        jenisId: jenis.id,
        kode: jenis.kode,
        nomor,
        label: `${jenis.kode}-${String(nomor).padStart(3, "0")}`,
        prioritas,
        status: "Menunggu",
        dibuatPada: Date.now(),
    };
    const semua = getTiket();
    semua.push(tiket);
    saveTiket(semua);
    return tiket;
}
export function resetAntrian() {
    saveTiket([]);
    saveCounter({});
}
