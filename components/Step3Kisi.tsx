import React, { useEffect, useState } from 'react';
import { generateKisiKisi } from '../services/geminiService';
import { AssessmentContext, BloomDistribution, KisiKisiItem } from '../types';

interface Props {
  ctx: AssessmentContext;
  cpText: string;
  bloom: BloomDistribution;
  kisiList: KisiKisiItem[];
  setKisiList: (list: KisiKisiItem[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const Step3Kisi: React.FC<Props> = ({ ctx, cpText, bloom, kisiList, setKisiList, onBack, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (kisiList.length === 0) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateKisiKisi(ctx, cpText, bloom);
      setKisiList(result);
    } catch (err) {
      setError("Gagal menghasilkan kisi-kisi. Pastikan API KEY valid atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 h-full flex flex-col">
      <div className="mb-6 flex items-end justify-between">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Preview <span className="text-accent2">Kisi-Kisi</span>
            </h2>
            <p className="text-sm text-gray-400">
            Review dan edit kisi-kisi sebelum generate soal.
            </p>
        </div>
        {!loading && kisiList.length > 0 && (
             <button onClick={handleGenerate} className="text-xs text-accent hover:text-accent2 underline font-mono">
                🔄 Generate Ulang
             </button>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border rounded-xl bg-surface/50">
            <div className="w-10 h-10 border-4 border-surface3 border-t-accent rounded-full animate-spin mb-4"></div>
            <p className="font-mono text-sm text-gray-400 animate-pulse">Merancang blueprint asesmen...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-900/20 border border-red-800 rounded-xl text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={handleGenerate} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">Coba Lagi</button>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-surface2 border border-border rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white font-mono">{kisiList.length}</div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold">Total Indikator</div>
                </div>
                <div className="bg-surface2 border border-border rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400 font-mono">{kisiList.filter(k=>k.bentuk==='PG').length}</div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold">PG</div>
                </div>
                <div className="bg-surface2 border border-border rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400 font-mono">{kisiList.filter(k=>['C4','C5','C6'].includes(k.level)).length}</div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold">HOTS</div>
                </div>
                 <div className="bg-surface2 border border-border rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400 font-mono">{kisiList.filter(k=>k.kesukaran==='Sedang').length}</div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold">Sedang</div>
                </div>
            </div>

            <div className="flex-1 overflow-auto border border-border rounded-lg bg-surface relative">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-surface2 sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-mono font-bold text-gray-400 border-b border-border w-12">No</th>
                            <th className="p-3 text-xs font-mono font-bold text-gray-400 border-b border-border">Indikator Soal</th>
                            <th className="p-3 text-xs font-mono font-bold text-gray-400 border-b border-border w-24">Level</th>
                            <th className="p-3 text-xs font-mono font-bold text-gray-400 border-b border-border w-24">Bentuk</th>
                            <th className="p-3 text-xs font-mono font-bold text-gray-400 border-b border-border w-28">Kesukaran</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kisiList.map((item, i) => (
                            <tr key={i} className="hover:bg-surface3/50 group border-b border-border/50 last:border-0">
                                <td className="p-3 font-mono text-gray-500">{item.no}</td>
                                <td className="p-3">
                                    <div className="text-gray-200 mb-1">{item.indikator}</div>
                                    <div className="flex gap-2 text-[10px] text-gray-500 font-mono">
                                        <span className="text-accent2">{item.tp}</span>
                                        <span>•</span>
                                        <span>{item.sub_materi}</span>
                                        <span>•</span>
                                        <span>Stimulus: {item.stimulus_type}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono
                                        ${['C1','C2'].includes(item.level) ? 'bg-blue-500/10 text-blue-400' :
                                          ['C3'].includes(item.level) ? 'bg-emerald-500/10 text-emerald-400' :
                                          'bg-red-500/10 text-red-400'
                                        }
                                    `}>{item.level}</span>
                                </td>
                                <td className="p-3 font-mono text-xs text-gray-400">{item.bentuk}</td>
                                <td className="p-3">
                                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono
                                        ${item.kesukaran === 'Mudah' ? 'text-success' :
                                          item.kesukaran === 'Sedang' ? 'text-warning' : 'text-danger'
                                        }
                                    `}>{item.kesukaran}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-5 py-2.5 bg-surface3 text-gray-300 hover:text-white border border-border rounded-lg text-sm font-semibold hover:bg-border transition-colors">
            &larr; Kembali
        </button>
        <button 
            onClick={onNext}
            disabled={loading || kisiList.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
        >
            Generate Butir Soal &rarr;
        </button>
      </div>
    </div>
  );
};

export default Step3Kisi;