type Role = "admin" | "moderator" | "user";

interface Session {
  token: string;
  role: Role;
  firstName: string;
}

type Prioritas = "Normal" | "Lansia" | "Disabilitas" | "VIP";

type StatusTiket = "Menunggu" | "Dipanggil" | "Selesai" | "Dilewati";

interface JenisAntrian {
  id: string;      
  kode: string;    
  nama: string;    
  aktif: boolean;  
}

interface Tiket {
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

interface CounterMap {
  [kode: string]: number;
}

type StorageKey = "session" | "jenisAntrian" | "tiket" | "counter";