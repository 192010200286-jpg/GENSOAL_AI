import React, { useState } from 'react';
import { AssessmentContext, KisiKisiItem, SoalItem } from '../types';

interface Props {
  ctx: AssessmentContext;
  kisiList: KisiKisiItem[];
  soalList: SoalItem[];
  onBack: () => void;
}

const Step5Export: React.FC<Props> = ({ ctx, kisiList, soalList, onBack }) => {
  const [copied, setCopied] = useState(false);

  // --- Helper: Generate Header HTML ---
  const getHeaderHTML = (title: string) => {
    return `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; padding: 0;">${title.toUpperCase()}</h2>
        <p style="margin: 5px 0;"><strong>Mata Pelajaran:</strong> ${ctx.mapel} | <strong>Kelas:</strong> ${ctx.kelas} ${ctx.jenjang}</p>
      </div>
      <table style="width: 100%; border: none; margin-bottom: 20px; font-family: 'Times New Roman', serif;">
        <tr>
          <td style="border: none; padding: 2px; width: 150px;"><strong>Jenis Asesmen</strong></td>
          <td style="border: none; padding: 2px;">: ${ctx.jenis_asesmen}</td>
          <td style="border: none; padding: 2px; width: 150px;"><strong>Kurikulum</strong></td>
          <td style="border: none; padding: 2px;">: ${ctx.kurikulum}</td>
        </tr>
        <tr>
          <td style="border: none; padding: 2px;"><strong>Materi Pokok</strong></td>
          <td style="border: none; padding: 2px;">: ${ctx.materi}</td>
           <td style="border: none; padding: 2px;"><strong>Alokasi Waktu</strong></td>
          <td style="border: none; padding: 2px;">: ${ctx.waktu} Menit</td>
        </tr>
      </table>
      <hr style="border: 1px solid #000; margin-bottom: 20px;" />
    `;
  };

  // --- Generator: Kisi-Kisi (HTML Table) ---
  const generateKisiHTML = () => {
    let html = getHeaderHTML("KISI-KISI PENULISAN SOAL");
    html += `
      <table style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 11pt;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid black; padding: 5px; text-align: center; width: 5%;">No</th>
            <th style="border: 1px solid black; padding: 5px; text-align: left; width: 25%;">Kompetensi / TP</th>
            <th style="border: 1px solid black; padding: 5px; text-align: left; width: 20%;">Materi</th>
            <th style="border: 1px solid black; padding: 5px; text-align: left; width: 30%;">Indikator Soal</th>
            <th style="border: 1px solid black; padding: 5px; text-align: center; width: 10%;">Level</th>
            <th style="border: 1px solid black; padding: 5px; text-align: center; width: 10%;">Bentuk</th>
          </tr>
        </thead>
        <tbody>
    `;

    kisiList.forEach(k => {
      html += `
        <tr>
          <td style="border: 1px solid black; padding: 5px; text-align: center;">${k.no}</td>
          <td style="border: 1px solid black; padding: 5px;">${k.tp}</td>
          <td style="border: 1px solid black; padding: 5px;">${k.sub_materi}</td>
          <td style="border: 1px solid black; padding: 5px;">${k.indikator}</td>
          <td style="border: 1px solid black; padding: 5px; text-align: center;">${k.level}<br/><span style="font-size: 9pt; color: #555;">(${k.kesukaran})</span></td>
          <td style="border: 1px solid black; padding: 5px; text-align: center;">${k.bentuk}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    return html;
  };

  // --- Generator: Naskah Soal (HTML List) ---
  const generateSoalHTML = (withKey = true) => {
    let html = getHeaderHTML("NASKAH SOAL ASESMEN");
    
    soalList.forEach(s => {
      html += `
        <div style="margin-bottom: 25px; page-break-inside: avoid; font-family: 'Times New Roman', serif; font-size: 12pt;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="width: 30px; vertical-align: top; font-weight: bold; border: none;">${s.no}.</td>
              <td style="border: none;">
      `;

      // Stimulus
      if (s.stimulus) {
        html += `<div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; margin-bottom: 10px; font-style: italic;">${s.stimulus.replace(/\n/g, '<br/>')}</div>`;
      }

      // Image
      if (s.image_data) {
        html += `<div style="margin-bottom: 10px;"><img src="data:image/jpeg;base64,${s.image_data}" style="max-width: 300px; height: auto; border: 1px solid #ccc;" /></div>`;
      } else if (s.image_prompt) {
         html += `<div style="margin-bottom: 10px; color: red; font-size: 10pt;">[Gambar tidak di-generate: ${s.image_prompt}]</div>`;
      }

      // Stem (Pertanyaan)
      html += `<div style="margin-bottom: 10px;">${s.stem.replace(/\n/g, '<br/>')}</div>`;

      // Opsi Jawaban
      if (s.opsi) {
        html += `<table style="width: 100%; border: none;">`;
        Object.entries(s.opsi).forEach(([key, val]) => {
            if(val) {
                const isKey = key === s.kunci;
                // Jika withKey true, tandai kunci jawaban
                const style = (withKey && isKey) ? "font-weight: bold; color: blue;" : "";
                html += `<tr><td style="width: 20px; border: none; vertical-align: top;">${key}.</td><td style="border: none; ${style}">${val}</td></tr>`;
            }
        });
        html += `</table>`;
      }

      // Pembahasan & Rubrik (Hanya muncul jika withKey = true)
      if (withKey) {
        html += `
          <div style="margin-top: 10px; border: 1px dashed #999; padding: 8px; background-color: #fcfcfc; font-size: 10pt;">
            <strong>Kunci: ${s.kunci}</strong><br/>
            <strong>Pembahasan:</strong> ${s.pembahasan}
            ${s.rubrik ? `<br/><strong>Pedoman Skor:</strong><br/>` + s.rubrik.map(r => `- ${r.aspek} (${r.skor}): ${r.deskriptor}`).join('<br/>') : ''}
          </div>
        `;
      }

      html += `
              </td>
            </tr>
          </table>
        </div>
      `;
    });

    return html;
  };

  const generateFullDoc = () => {
    return generateKisiHTML() + `<br style="page-break-before: always;" />` + generateSoalHTML(true);
  };

  // --- Copy Text Logic (Keep plain text for Clipboard) ---
  const generatePlainContext = () => {
     let output = `KISI-KISI & SOAL - ${ctx.mapel}\n\n`;
     soalList.forEach(s => {
         output += `${s.no}. ${s.stem}\n`;
         if(s.opsi) Object.entries(s.opsi).forEach(([k,v]) => output += `   ${k}. ${v}\n`);
         output += `   Kunci: ${s.kunci}\n\n`;
     });
     return output;
  }

  const handleCopy = () => {
    const text = generatePlainContext();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Download Logic (.doc) ---
  const downloadDoc = (filename: string, contentGenerator: () => string) => {
     const bodyContent = contentGenerator();
     
     // Wrapper HTML agar dikenali Word dengan benar
     const htmlDoc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${filename}</title>
            <style>
                body { font-family: 'Times New Roman', serif; font-size: 12pt; }
                table { border-collapse: collapse; }
                td, th { vertical-align: top; }
            </style>
        </head>
        <body>
            ${bodyContent}
        </body>
        </html>
     `;

     const blob = new Blob(['\ufeff', htmlDoc], { type: 'application/msword' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = filename; // Ekstensi .doc agar Word membukanya sebagai Web Layout / Print Layout
     a.click();
     URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 h-full flex flex-col">
       <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Review Final & <span className="text-accent2">Export</span>
        </h2>
        <p className="text-sm text-gray-400">
          Unduh dokumen dalam format <strong>Microsoft Word (.doc)</strong> agar mudah diedit atau diunggah ke <strong>Google Docs</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Summary - Left Column */}
        <div className="lg:col-span-1 bg-surface border border-border rounded-xl p-6 h-fit">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-6">Ringkasan</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-gray-400 text-sm">Jumlah Soal</span>
                    <span className="text-white font-mono font-bold">{soalList.length} Butir</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-gray-400 text-sm">Estimasi Waktu</span>
                    <span className="text-white font-mono font-bold">{ctx.waktu} Menit</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-gray-400 text-sm">Rata-rata Kualitas</span>
                    <span className="text-accent2 font-mono font-bold">
                        {Math.round(soalList.reduce((acc, s) => acc + s.skor_qa, 0) / (soalList.length || 1))} / 100
                    </span>
                </div>
                <div className="flex justify-between items-center pb-1">
                    <span className="text-gray-400 text-sm">Status Validasi</span>
                    <span className="text-success font-mono font-bold">Siap</span>
                </div>
            </div>
        </div>

        {/* Actions - Right Column (2 cols wide) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Download Kisi-Kisi */}
             <button 
                onClick={() => downloadDoc(`KISI-KISI_${ctx.mapel}_${ctx.kelas}.doc`, generateKisiHTML)}
                className="group bg-surface2 border border-border hover:border-blue-500 p-6 rounded-xl text-left transition-all hover:bg-surface3"
             >
                <div className="text-2xl mb-3 text-blue-400">📊</div>
                <div className="font-bold text-white mb-1">Unduh Kisi-Kisi (.doc)</div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300">File tabel kisi-kisi rapi, siap print.</div>
             </button>

             {/* Download Soal */}
             <button 
                onClick={() => downloadDoc(`SOAL_${ctx.mapel}_${ctx.kelas}.doc`, () => generateSoalHTML(true))}
                className="group bg-surface2 border border-border hover:border-green-500 p-6 rounded-xl text-left transition-all hover:bg-surface3"
             >
                <div className="text-2xl mb-3 text-green-400">📝</div>
                <div className="font-bold text-white mb-1">Unduh Naskah Soal (.doc)</div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300">File soal + gambar + kunci & pembahasan.</div>
             </button>

             {/* Download All */}
             <button 
                onClick={() => downloadDoc(`PAKET_LENGKAP_${ctx.mapel}_${ctx.kelas}.doc`, generateFullDoc)}
                className="md:col-span-2 group bg-surface2 border border-border hover:border-white p-4 rounded-xl text-center transition-all hover:bg-surface3 mt-2 flex flex-col items-center justify-center gap-2"
             >
                <span className="text-2xl">📁</span>
                <span className="font-bold text-gray-300 group-hover:text-white text-sm">Unduh Paket Lengkap (Kisi + Soal) .doc</span>
                <span className="text-[10px] text-gray-500">Kompatibel dengan MS Word & Google Docs</span>
             </button>

             {/* Copy Button (Secondary) */}
             <button onClick={handleCopy} className="md:col-span-2 bg-transparent border border-dashed border-border hover:border-accent p-3 rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:text-accent transition-all mt-2">
                <span className="text-xs font-mono">{copied ? '✅ Teks berhasil disalin!' : '📋 Salin teks kasar ke Clipboard'}</span>
             </button>
        </div>
      </div>

       <div className="flex justify-start mt-auto">
        <button onClick={onBack} className="px-5 py-2.5 bg-surface3 text-gray-300 hover:text-white border border-border rounded-lg text-sm font-semibold hover:bg-border transition-colors">
            &larr; Kembali ke Soal
        </button>
      </div>
    </div>
  );
};

export default Step5Export;