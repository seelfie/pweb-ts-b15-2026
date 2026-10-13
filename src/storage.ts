import type { JenisAntrian, Tiket, CounterMap, Prioritas } from "./types/antrian.js";
 
type StorageKey = "jenisAntrian" | "tiket" | "counter";
 
function bacaData<T>(key: StorageKey, bawaan: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : bawaan;
  } catch {
    return bawaan; 
  }
}
 
function simpanData<T>(key: StorageKey, nilai: T): void {
  localStorage.setItem(key, JSON.stringify(nilai));
}
 
export function getJenisAntrian(): JenisAntrian[] {
  return bacaData<JenisAntrian[]>("jenisAntrian", []);
}
 
export function saveJenisAntrian(data: JenisAntrian[]): void {
  simpanData("jenisAntrian", data);
}
 
export function getTiket(): Tiket[] {
  return bacaData<Tiket[]>("tiket", []);
}
 
export function saveTiket(data: Tiket[]): void {
  simpanData("tiket", data);
}
 
export function getCounter(): CounterMap {
  return bacaData<CounterMap>("counter", {});
}
 
export function saveCounter(data: CounterMap): void {
  simpanData("counter", data);
}

export function buatTiket(jenis: JenisAntrian, prioritas: Prioritas): Tiket {
  const counter = getCounter();
  const nomor = (counter[jenis.kode] ?? 0) + 1;
  counter[jenis.kode] = nomor;
  saveCounter(counter);
 
  const tiket: Tiket = {
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
 
export function resetAntrian(): void {
  saveTiket([]);
  saveCounter({});
}