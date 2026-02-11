import React, { useEffect, useState } from 'react';
import { generateSoalBatch, generateSoalImage } from '../services/geminiService';
import { AssessmentContext, KisiKisiItem, SoalItem } from '../types';

interface Props {
  ctx: AssessmentContext;
  kisiList: KisiKisiItem[];
  soalList: SoalItem[];
  setSoalList: (list: SoalItem[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const Step4Soal: React.FC<Props> = ({ ctx, kisiList, soalList, setSoalList, onBack, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // State khusus untuk loading gambar per soal
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    if (soalList.length === 0 && kisiList.length > 0) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateSoalBatch(ctx, kisiList);
      setSoalList(result);
    } catch (err) {
      setError("Gagal menulis butir soal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (soalIndex: number, prompt: string) => {
    if (!prompt) return;
    
    setImageLoading(true);
    try {
        const base64Data = await generateSoalImage(prompt);
        // Update soal list dengan gambar baru
        const updatedList = [...soalList];
        updatedList[soalIndex] = {
            ...updatedList[soalIndex],
            image_data: base64Data
        };
        setSoalList(updatedList);
    } catch (err) {
        alert("Gagal meng-generate gambar. Pastikan kuota API mencukupi.");
    } finally {
        setImageLoading(false);
    }
  };

  const currentSoal = soalList[activeTab];

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-black mb-2 tracking-tight">
          Butir Soal + <span className="text-accent2">Validasi Otomatis</span>
        </h2>
        <p className="text-sm text-gray-800 font-medium">
           Soal divalidasi oleh AI. Hijau = Pass, Kuning = Warning.
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border rounded-xl bg-surface/50">
             <div className="w-10 h-10 border-4 border-surface3 border-t-accent rounded-full animate-spin mb-4"></div>
            <p className="font-mono text-sm text-gray-800 animate-pulse text-center font-bold">
                Menulis {kisiList.length} butir soal...<br/>
                <span className="text-xs text-gray-600">Menganalisis stimulus & memvalidasi konstruksi</span>
            </p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-700 font-bold mb-4">{error}</p>
            <button onClick={handleGenerate} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 font-bold">Coba Lagi</button>
        </div>
      ) : soalList.length > 0 ? (
        <div className="flex-1 flex gap-4 overflow-hidden h-full">
            {/* Soal Navigation List */}
            <div className="w-16 md:w-64 flex flex-col gap-2 overflow-y-auto pr-2 border-r border-border/50">
                {soalList.map((s, idx) => {
                    const warnings = s.validasi.filter(v => v.status === 'WARN').length;
                    const fails = s.validasi.filter(v => v.status === 'FAIL').length;
                    const statusColor = fails > 0 ? 'bg-red-500' : warnings > 0 ? 'bg-yellow-500' : 'bg-green-500';

                    return (
                        <button 
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden group
                                ${activeTab === idx 
                                    ? 'bg-emerald-50 border-accent shadow-sm' 
                                    : 'bg-surface border-border hover:border-gray-400'}
                            `}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-mono font-bold ${activeTab === idx ? 'text-accent' : 'text-gray-600'}`}>No {s.no}</span>
                                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                            </div>
                            <div className="hidden md:block text-[10px] text-gray-800 font-medium truncate">{s.stem}</div>
                             {s.image_prompt && (
                                <div className="hidden md:block absolute top-1 right-1">
                                    <span className="text-[8px] bg-blue-100 text-blue-800 px-1 rounded border border-blue-200 font-bold">IMG</span>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Active Soal Detail */}
            <div className="flex-1 overflow-y-auto pr-2">
                {currentSoal && (
                    <div className="space-y-4">
                        {/* Validation Banner */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <div className="px-3 py-1 bg-surface3 rounded border border-border flex items-center gap-2 whitespace-nowrap">
                                <span className="text-xs font-mono text-gray-800 font-bold">QA Score:</span>
                                <span className={`font-bold font-mono ${currentSoal.skor_qa > 80 ? 'text-success' : 'text-warning'}`}>{currentSoal.skor_qa}/100</span>
                            </div>
                            {currentSoal.validasi.map((v, i) => (
                                <div key={i} className={`px-3 py-1 rounded border flex items-center gap-2 text-xs whitespace-nowrap
                                    ${v.status === 'PASS' ? 'bg-green-100 border-green-300 text-green-800' :
                                      v.status === 'WARN' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                                      'bg-red-100 border-red-300 text-red-800'}
                                `}>
                                    <span className="font-bold">{v.status === 'PASS' ? '✓' : v.status === 'WARN' ? '!' : 'X'}</span>
                                    <span className="font-semibold">{v.rule}</span>
                                </div>
                            ))}
                        </div>

                        {/* Card */}
                        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                                <div className="px-2 py-1 bg-accent text-white font-mono font-bold rounded text-sm">{currentSoal.bentuk}</div>
                                <div className="text-xs text-gray-600 font-mono font-bold">Level: <span className="text-black">{currentSoal.level}</span></div>
                                <div className="text-xs text-gray-600 font-mono font-bold">Kesukaran: <span className="text-black">{currentSoal.kesukaran}</span></div>
                            </div>

                            {/* Stimulus Section (Text & Image) */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-[10px] uppercase font-bold text-blue-700 mb-2 tracking-widest">Stimulus</div>
                                
                                {currentSoal.stimulus && (
                                    <p className="text-sm text-black font-medium leading-relaxed whitespace-pre-line mb-3">{currentSoal.stimulus}</p>
                                )}

                                {/* Image Generation Area */}
                                {currentSoal.image_prompt ? (
                                    <div className="mt-4 border-t border-blue-200 pt-4">
                                        {currentSoal.image_data ? (
                                            <div className="relative group">
                                                <img 
                                                    src={`data:image/jpeg;base64,${currentSoal.image_data}`} 
                                                    alt="Generated Stimulus" 
                                                    className="w-full max-w-md h-auto rounded-lg border border-border"
                                                />
                                                <button 
                                                    onClick={() => handleGenerateImage(activeTab, currentSoal.image_prompt!)}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/80 text-white text-xs px-2 py-1 rounded transition-opacity font-bold"
                                                >
                                                    Regenerate
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-700 italic font-medium">Soal ini memerlukan gambar/ilustrasi.</span>
                                                    <button 
                                                        onClick={() => handleGenerateImage(activeTab, currentSoal.image_prompt!)}
                                                        disabled={imageLoading}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent2 disabled:opacity-50 text-white text-xs font-bold rounded transition-colors"
                                                    >
                                                        {imageLoading ? 'Generating...' : '✨ Generate AI Image'}
                                                    </button>
                                                </div>
                                                <div className="p-2 bg-white/50 rounded text-[10px] font-mono text-gray-700 truncate border border-blue-200">
                                                    Prompt: {currentSoal.image_prompt}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>

                            <div className="mb-6">
                                <p className="text-base font-bold text-black leading-relaxed whitespace-pre-line">{currentSoal.stem}</p>
                            </div>

                            {currentSoal.opsi && (
                                <div className="space-y-2 mb-6">
                                    {Object.entries(currentSoal.opsi).map(([key, val]) => {
                                        if(!val) return null;
                                        const isKey = key === currentSoal.kunci;
                                        return (
                                            <div key={key} className={`flex gap-3 p-3 rounded-lg border text-sm transition-colors
                                                ${isKey ? 'bg-green-100 border-green-300 text-green-900 font-bold' : 'bg-surface2 border-transparent text-gray-900 font-medium'}
                                            `}>
                                                <span className="font-mono font-bold w-4">{key}.</span>
                                                <span>{val}</span>
                                                {isKey && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-green-600 text-white px-2 py-0.5 rounded">Kunci</span>}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-border">
                                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Pembahasan</h4>
                                <p className="text-sm text-gray-900 font-medium leading-relaxed whitespace-pre-line">{currentSoal.pembahasan}</p>
                            </div>
                            
                            {currentSoal.rubrik && (
                                <div className="mt-6 pt-6 border-t border-border">
                                    <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Rubrik Penilaian</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="text-gray-800 font-mono border-b border-border">
                                                <tr>
                                                    <th className="py-2 font-bold">Aspek</th>
                                                    <th className="py-2 font-bold">Deskriptor</th>
                                                    <th className="py-2 text-right font-bold">Skor</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-900">
                                                {currentSoal.rubrik.map((r, ri) => (
                                                    <tr key={ri} className="border-b border-border/50">
                                                        <td className="py-2 pr-4 align-top font-bold">{r.aspek}</td>
                                                        <td className="py-2 pr-4 text-gray-800 font-medium">{r.deskriptor}</td>
                                                        <td className="py-2 text-right font-mono align-top text-accent2 font-bold">{r.skor}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
      ) : null}

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-5 py-2.5 bg-surface3 text-gray-900 hover:text-black border border-border rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
            &larr; Kembali
        </button>
        <button 
            onClick={onNext}
            disabled={loading || soalList.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
        >
            Review & Export &rarr;
        </button>
      </div>
    </div>
  );
};

export default Step4Soal;