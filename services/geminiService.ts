import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AssessmentContext, BloomDistribution, KisiKisiItem, SoalItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';
const IMAGE_MODEL_NAME = 'imagen-3.0-generate-001';

// --- Schemas ---

const kisiKisiSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      no: { type: Type.INTEGER },
      tp: { type: Type.STRING, description: "Tujuan Pembelajaran" },
      sub_materi: { type: Type.STRING },
      indikator: { type: Type.STRING, description: "Indikator Soal lengkap" },
      kko: { type: Type.STRING, description: "Kata Kerja Operasional" },
      level: { type: Type.STRING, description: "Level Kognitif (C1-C6)" },
      bentuk: { type: Type.STRING, enum: ["PG", "Uraian", "Isian"] },
      kesukaran: { type: Type.STRING, enum: ["Mudah", "Sedang", "Sulit"] },
      stimulus_type: { type: Type.STRING, description: "Jenis stimulus (Teks, Gambar, Tabel, Grafik, dll)" }
    },
    required: ["no", "tp", "sub_materi", "indikator", "kko", "level", "bentuk", "kesukaran", "stimulus_type"]
  }
};

const soalSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      no: { type: Type.INTEGER },
      bentuk: { type: Type.STRING },
      level: { type: Type.STRING },
      kesukaran: { type: Type.STRING },
      tp: { type: Type.STRING },
      kko: { type: Type.STRING },
      stimulus: { type: Type.STRING, nullable: true },
      image_prompt: { 
        type: Type.STRING, 
        nullable: true, 
        description: "Deskripsi visual detail dalam Bahasa Inggris untuk generate gambar. Sertakan subject, art style, perspective, dan lighting." 
      },
      stem: { type: Type.STRING, description: "Pertanyaan inti soal" },
      opsi: { 
        type: Type.OBJECT, 
        properties: {
            A: { type: Type.STRING },
            B: { type: Type.STRING },
            C: { type: Type.STRING },
            D: { type: Type.STRING },
            E: { type: Type.STRING, nullable: true }
        },
        nullable: true
      },
      kunci: { type: Type.STRING },
      pembahasan: { type: Type.STRING },
      validasi: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            rule: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["PASS", "WARN", "FAIL"] },
            catatan: { type: Type.STRING }
          }
        }
      },
      skor_qa: { type: Type.INTEGER }
    },
    required: ["no", "stem", "kunci", "pembahasan", "validasi", "skor_qa"]
  }
};

// --- Generators ---

export const generateContextSuggestion = async (ctx: AssessmentContext): Promise<string> => {
  if (!apiKey) throw new Error("API Key Missing");
  
  const prompt = `
    Berikan satu kalimat singkat (maksimal 15 kata) untuk "Batasan Konteks" atau tema spesifik yang relevan untuk soal ujian sekolah.
    
    Informasi Mapel:
    - Mapel: ${ctx.mapel}
    - Jenjang: ${ctx.jenjang} Kelas ${ctx.kelas}
    - Materi: ${ctx.materi}
    - Sub-materi: ${ctx.submateri}

    Contoh Output: "Penerapan dalam transaksi jual beli di pasar tradisional" atau "Fenomena pemanasan global di lingkungan sekitar".
    Hanya berikan teks konteksnya saja tanpa tanda kutip.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error generating context:", error);
    return "";
  }
};

export const generateKisiKisi = async (
  ctx: AssessmentContext, 
  cpText: string, 
  bloom: BloomDistribution
): Promise<KisiKisiItem[]> => {
  
  if (!apiKey) throw new Error("API Key Missing");

  const totalSoal = ctx.jml_pg + ctx.jml_uraian + ctx.jml_isian;
  
  const prompt = `
    Bertindaklah sebagai ahli kurikulum dan asesmen. 
    Buatlah Kisi-Kisi Soal (Blueprint) sebanyak ${totalSoal} butir.
    
    Konteks:
    - Mapel: ${ctx.mapel}
    - Kelas: ${ctx.kelas}
    - Materi: ${ctx.materi} (${ctx.submateri})
    - CP/KD: ${cpText}
    
    Distribusi Bentuk Soal:
    - PG: ${ctx.jml_pg}
    - Uraian: ${ctx.jml_uraian}
    - Isian: ${ctx.jml_isian}
    
    Distribusi Level Kognitif (Target):
    - C1: ${bloom.c1}, C2: ${bloom.c2}, C3: ${bloom.c3}
    - C4: ${bloom.c4}, C5: ${bloom.c5}, C6: ${bloom.c6}
    
    Instruksi:
    1. Pastikan indikator soal operasional dan spesifik.
    2. Variasikan tingkat kesukaran (Mudah, Sedang, Sulit).
    3. Tentukan jenis stimulus yang relevan (misal: wacana, gambar, grafik).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: kisiKisiSchema,
        temperature: 0.4,
      }
    });

    const json = JSON.parse(response.text || "[]");
    return json as KisiKisiItem[];
  } catch (error) {
    console.error("Error generating Kisi-Kisi:", error);
    throw error;
  }
};

export const generateSoalBatch = async (
  ctx: AssessmentContext,
  kisiList: KisiKisiItem[]
): Promise<SoalItem[]> => {
  
  if (!apiKey) throw new Error("API Key Missing");

  const simplifiedKisi = kisiList.map(k => ({
    no: k.no,
    indikator: k.indikator,
    level: k.level,
    bentuk: k.bentuk,
    kesukaran: k.kesukaran,
    stimulus_type: k.stimulus_type
  }));

  const prompt = `
    Bertindaklah sebagai penulis soal profesional.
    Buatlah butir soal lengkap berdasarkan data kisi-kisi berikut.
    
    Konteks:
    - Mapel: ${ctx.mapel}
    - Jenjang: ${ctx.jenjang}
    - Materi: ${ctx.materi}
    - Batasan Konteks: ${ctx.konteks}
    
    Instruksi Penulisan:
    1. Buat stimulus (teks/deskripsi gambar) yang menarik dan relevan.
    2. PENTING: Jika stimulus_type adalah Gambar/Grafik/Diagram, buatlah 'image_prompt' (Bahasa Inggris) yang SANGAT DETAIL dan DESKRIPTIF.
       - Tentukan GAYA VISUAL: Misal "clean geometric vector diagram" (Matematika), "realistic scientific illustration" (Biologi), "historical painting style" (Sejarah).
       - Tentukan PERSPEKTIF: Misal "cross-section view" (Biologi), "isometric view" (Teknik), "top-down map" (Geografi).
       - Tentukan KOMPOSISI: Misal "centered subject on white background", "exploded view", "step-by-step diagram".
       - Contoh: "A detailed cross-section diagram of a dicot stem showing xylem and phloem, realistic scientific illustration style, white background, clear anatomical details".
    3. Jika tidak butuh gambar, 'image_prompt' diisi null.
    4. Pastikan STEM (pokok soal) jelas.
    
    Data Kisi-Kisi:
    ${JSON.stringify(simplifiedKisi, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: soalSchema,
        temperature: 0.7, 
      }
    });

    const json = JSON.parse(response.text || "[]");
    
    return json.map((s: any, idx: number) => ({
        ...s,
        tp: kisiList[idx]?.tp || '',
        kko: kisiList[idx]?.kko || '',
        level: kisiList[idx]?.level || '',
        kesukaran: kisiList[idx]?.kesukaran || '',
        no: kisiList[idx]?.no || s.no
    })) as SoalItem[];

  } catch (error) {
    console.error("Error generating Soal:", error);
    throw error;
  }
};

export const generateSoalImage = async (imagePrompt: string): Promise<string> => {
    if (!apiKey) throw new Error("API Key Missing");

    try {
        const response = await ai.models.generateImages({
            model: IMAGE_MODEL_NAME,
            prompt: imagePrompt + ", educational textbook style, high resolution, clear details, soft professional lighting, white background, no text labels inside",
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '4:3',
            },
        });

        const base64String = response.generatedImages?.[0]?.image?.imageBytes;
        if (!base64String) throw new Error("No image generated");
        
        return base64String;
    } catch (error) {
        console.error("Error generating Image:", error);
        throw error;
    }
}
