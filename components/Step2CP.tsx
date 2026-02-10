import React from 'react';
import { BloomDistribution } from '../types';

interface Props {
  cpText: string;
  setCpText: (val: string) => void;
  bloom: BloomDistribution;
  setBloom: (val: BloomDistribution) => void;
  totalSoal: number;
  onBack: () => void;
  onNext: () => void;
}

const Step2CP: React.FC<Props> = ({ cpText, setCpText, bloom, setBloom, totalSoal, onBack, onNext }) => {

  const handleBloomChange = (level: keyof BloomDistribution, val: string) => {
    const num = parseInt(val) || 0;
    setBloom({ ...bloom, [level]: num });
  };

  const currentTotal = (Object.values(bloom) as number[]).reduce((a, b) => a + b, 0);
  const isValid = currentTotal === totalSoal && cpText.length > 10;

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          CP/TP & <span className="text-accent2">Distribusi Kognitif</span>
        </h2>
        <p className="text-sm text-gray-400">
          Masukkan Capaian Pembelajaran dan atur distribusi level Bloom.
        </p>
      </div>

      {/* CP Input */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">📖 Capaian Pembelajaran (CP) / KD</h3>
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase font-mono">Teks CP atau KD <span className="text-accent">*</span></label>
            <textarea 
                value={cpText} 
                onChange={(e) => setCpText(e.target.value)}
                rows={4} 
                className="bg-surface2 border border-border rounded-lg text-sm text-white p-3 focus:border-accent outline-none resize-y min-h-[100px]" 
                placeholder="Tempel teks CP dari dokumen kurikulum..."
            />
        </div>
      </div>

      {/* Bloom Distribution */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
                🧠 Distribusi Taksonomi Bloom
            </h3>
            <span className={`text-xs font-mono font-bold ${currentTotal === totalSoal ? 'text-success' : 'text-danger'}`}>
                Total: {currentTotal} / {totalSoal} Soal
            </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {[1,2,3,4,5,6].map((lvl) => {
                const key = `c${lvl}` as keyof BloomDistribution;
                const colors = ['text-slate-400', 'text-blue-400', 'text-emerald-400', 'text-yellow-400', 'text-orange-400', 'text-red-400'];
                return (
                    <div key={lvl} className="bg-surface2 border border-border rounded-lg p-3 text-center">
                        <div className={`font-mono text-lg font-bold mb-1 ${colors[lvl-1]}`}>C{lvl}</div>
                        <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide">
                            {['Ingat', 'Paham', 'Terap', 'Analisis', 'Evaluasi', 'Cipta'][lvl-1]}
                        </div>
                        <input 
                            type="number" 
                            min="0"
                            value={bloom[key]}
                            onChange={(e) => handleBloomChange(key, e.target.value)}
                            className="w-full bg-surface3 border border-border rounded px-2 py-1 text-center font-mono text-sm focus:border-accent outline-none"
                        />
                    </div>
                );
            })}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-5 py-2.5 bg-surface3 text-gray-300 hover:text-white border border-border rounded-lg text-sm font-semibold hover:bg-border transition-colors">
            &larr; Kembali
        </button>
        <button 
            onClick={onNext}
            disabled={!isValid}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
        >
            Generate Kisi-Kisi &rarr;
        </button>
      </div>
    </div>
  );
};

export default Step2CP;