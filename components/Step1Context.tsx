import React, { useState } from 'react';
import { AssessmentContext } from '../types';
import { generateContextSuggestion } from '../services/geminiService';

interface Props {
  data: AssessmentContext;
  updateData: (key: keyof AssessmentContext, value: any) => void;
  onNext: () => void;
}

const Step1Context: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [loadingContext, setLoadingContext] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    // @ts-ignore
    const val = type === 'number' ? parseInt(value) || 0 : value;
    updateData(id as keyof AssessmentContext, val);
  };

  const handleAutoContext = async () => {
    if (!data.materi) return;
    setLoadingContext(true);
    try {
      const suggestion = await generateContextSuggestion(data);
      if (suggestion) {
        updateData('konteks', suggestion);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingContext(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Konteks <span className="text-accent2">Asesmen</span>
        </h2>
        <p className="text-sm text-gray-400">
          Isi identitas paket soal. Field bertanda <span className="text-accent">*</span> wajib diisi.
        </p>
      </div>

      {/* Identity Card */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
          📋 Identitas Paket Soal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mapel" className="text-xs font-semibold text-gray-400 uppercase font-mono">Mata Pelajaran <span className="text-accent">*</span></label>
            <select id="mapel" value={data.mapel} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none focus:ring-1 focus:ring-accent/20 transition-all">
              <option value="">Pilih Mapel</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="IPAS">IPAS (SD)</option>
              <option value="IPA">IPA</option>
              <option value="IPS">IPS</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="Fisika">Fisika</option>
              <option value="Kimia">Kimia</option>
              <option value="Biologi">Biologi</option>
              <option value="Sejarah">Sejarah</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="jenjang" className="text-xs font-semibold text-gray-400 uppercase font-mono">Jenjang <span className="text-accent">*</span></label>
            <select id="jenjang" value={data.jenjang} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none">
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="kelas" className="text-xs font-semibold text-gray-400 uppercase font-mono">Kelas <span className="text-accent">*</span></label>
            <select id="kelas" value={data.kelas} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none">
              <option value="1">Kelas 1</option>
              <option value="2">Kelas 2</option>
              <option value="3">Kelas 3</option>
              <option value="4">Kelas 4</option>
              <option value="5">Kelas 5</option>
              <option value="6">Kelas 6</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
              <option value="10">Kelas 10</option>
              <option value="11">Kelas 11</option>
              <option value="12">Kelas 12</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="semester" className="text-xs font-semibold text-gray-400 uppercase font-mono">Semester</label>
            <select id="semester" value={data.semester} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none">
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="kurikulum" className="text-xs font-semibold text-gray-400 uppercase font-mono">Kurikulum</label>
            <select id="kurikulum" value={data.kurikulum} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none">
              <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
              <option value="K13">Kurikulum 2013 (K13)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
             <label htmlFor="jenis_asesmen" className="text-xs font-semibold text-gray-400 uppercase font-mono">Jenis Asesmen</label>
            <select id="jenis_asesmen" value={data.jenis_asesmen} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none">
              <option value="Ulangan Harian">Ulangan Harian (UH)</option>
              <option value="PTS">PTS / STS</option>
              <option value="PAS">PAS / SAS</option>
              <option value="US">Ujian Sekolah</option>
            </select>
          </div>
           <div className="flex flex-col gap-1.5">
            <label htmlFor="waktu" className="text-xs font-semibold text-gray-400 uppercase font-mono">Waktu (Menit)</label>
            <input type="number" id="waktu" value={data.waktu} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none" />
          </div>
        </div>
      </div>

      {/* Topic Card */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">📚 Topik & Materi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex flex-col gap-1.5">
            <label htmlFor="materi" className="text-xs font-semibold text-gray-400 uppercase font-mono">Materi Pokok <span className="text-accent">*</span></label>
            <input type="text" id="materi" value={data.materi} onChange={handleChange} placeholder="Contoh: Aljabar Linear" className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none" />
          </div>
           <div className="flex flex-col gap-1.5">
            <label htmlFor="submateri" className="text-xs font-semibold text-gray-400 uppercase font-mono">Sub-Materi / Topik Spesifik</label>
            <input type="text" id="submateri" value={data.submateri} onChange={handleChange} placeholder="Metode Substitusi, Eliminasi..." className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mt-4">
            <label htmlFor="konteks" className="text-xs font-semibold text-gray-400 uppercase font-mono">
                Batasan Konteks
                <span className="ml-2 text-[10px] text-gray-500 font-normal normal-case">(Opsional - bisa diisi otomatis AI)</span>
            </label>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    id="konteks" 
                    value={data.konteks} 
                    onChange={handleChange} 
                    placeholder="Contoh: Kehidupan sehari-hari, jual beli pasar..." 
                    className="flex-1 bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none" 
                />
                <button 
                    onClick={handleAutoContext}
                    disabled={loadingContext || !data.materi}
                    className="px-4 py-2 bg-surface3 border border-border hover:bg-accent hover:border-accent hover:text-white rounded-lg text-xs font-mono font-bold text-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loadingContext ? (
                        <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                    ) : '✨ AI Auto'}
                </button>
            </div>
        </div>
      </div>

       {/* Quantity Card */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">🎯 Jumlah Soal</h3>
        <div className="grid grid-cols-3 gap-4">
           <div className="flex flex-col gap-1.5">
            <label htmlFor="jml_pg" className="text-xs font-semibold text-gray-400 uppercase font-mono">Pilihan Ganda</label>
            <input type="number" id="jml_pg" min="0" max="50" value={data.jml_pg} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none text-center font-mono font-bold" />
          </div>
           <div className="flex flex-col gap-1.5">
            <label htmlFor="jml_uraian" className="text-xs font-semibold text-gray-400 uppercase font-mono">Uraian</label>
            <input type="number" id="jml_uraian" min="0" max="10" value={data.jml_uraian} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none text-center font-mono font-bold" />
          </div>
           <div className="flex flex-col gap-1.5">
            <label htmlFor="jml_isian" className="text-xs font-semibold text-gray-400 uppercase font-mono">Isian Singkat</label>
            <input type="number" id="jml_isian" min="0" max="20" value={data.jml_isian} onChange={handleChange} className="bg-surface2 border border-border rounded-lg text-sm text-white p-2.5 focus:border-accent outline-none text-center font-mono font-bold" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
            onClick={onNext}
            disabled={!data.mapel || !data.materi}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent2 disabled:bg-surface3 disabled:text-gray-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
        >
            Lanjut ke CP/TP &rarr;
        </button>
      </div>

    </div>
  );
};

export default Step1Context;