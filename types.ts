export interface AssessmentContext {
  mapel: string;
  jenjang: string;
  kelas: string;
  semester: string;
  kurikulum: string;
  jenis_asesmen: string;
  waktu: number;
  tahun: string;
  sekolah: string;
  materi: string;
  submateri: string;
  konteks: string;
  jml_pg: number;
  jml_uraian: number;
  jml_isian: number;
}

export interface BloomDistribution {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  c6: number;
}

export interface KisiKisiItem {
  no: number;
  tp: string;
  sub_materi: string;
  indikator: string;
  kko: string;
  level: string;
  bentuk: 'PG' | 'Uraian' | 'Isian';
  kesukaran: 'Mudah' | 'Sedang' | 'Sulit';
  stimulus_type: string;
}

export interface ValidationRule {
  rule: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  catatan: string;
}

export interface SoalItem {
  no: number;
  bentuk: string;
  level: string;
  kesukaran: string;
  tp: string;
  kko: string;
  stimulus: string | null;
  image_prompt?: string | null; // Prompt untuk generator gambar
  image_data?: string | null;   // Base64 string gambar yang digenerate
  stem: string;
  opsi?: { [key: string]: string };
  kunci: string;
  pembahasan: string;
  rubrik?: { aspek: string; deskriptor: string; skor: number }[];
  validasi: ValidationRule[];
  skor_qa: number;
}

export type AppStep = 1 | 2 | 3 | 4 | 5;