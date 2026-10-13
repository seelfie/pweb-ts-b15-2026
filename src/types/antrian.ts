export type Prioritas = "Normal" | "Lansia" | "Disabilitas" | "VIP";

export type StatusTiket = "Menunggu" | "Dipanggil" | "Selesai" | "Dilewati";

export interface JenisAntrian {
  id: string;     
  kode: string;    
  nama: string;    
  aktif: boolean;  
}

export interface Tiket {
  id: string;            
  jenisId: string;       
  kode: string;          
  nomor: number;         
  label: string;         
  prioritas: Prioritas;
  status: StatusTiket;
  dibuatPada: number;    
  dipanggilPada?: number;
}

export interface CounterMap {
  [kode: string]: number;
}