import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Step1Context from './components/Step1Context';
import Step2CP from './components/Step2CP';
import Step3Kisi from './components/Step3Kisi';
import Step4Soal from './components/Step4Soal';
import Step5Export from './components/Step5Export';
import { AppStep, AssessmentContext, BloomDistribution, KisiKisiItem, SoalItem } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(1);
  const [stepsCompleted, setStepsCompleted] = useState<number>(0);

  // State
  const [contextData, setContextData] = useState<AssessmentContext>({
    mapel: 'Matematika',
    jenjang: 'SMP',
    kelas: '8',
    semester: '1',
    kurikulum: 'Kurikulum Merdeka',
    jenis_asesmen: 'Ulangan Harian',
    waktu: 90,
    tahun: '2024/2025',
    sekolah: '',
    materi: '',
    submateri: '',
    konteks: '',
    jml_pg: 5,
    jml_uraian: 2,
    jml_isian: 0,
  });

  const [cpText, setCpText] = useState('');
  const [bloom, setBloom] = useState<BloomDistribution>({
    c1: 0, c2: 1, c3: 3, c4: 2, c5: 1, c6: 0
  });

  const [kisiList, setKisiList] = useState<KisiKisiItem[]>([]);
  const [soalList, setSoalList] = useState<SoalItem[]>([]);

  // Handlers
  const handleUpdateContext = (key: keyof AssessmentContext, value: any) => {
    setContextData(prev => ({ ...prev, [key]: value }));
  };

  const advanceStep = () => {
    if (step > stepsCompleted) setStepsCompleted(step);
    if (step < 5) setStep((prev) => (prev + 1) as AppStep);
  };

  const goBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as AppStep);
  };

  const totalSoal = contextData.jml_pg + contextData.jml_uraian + contextData.jml_isian;

  return (
    <div className="flex h-screen bg-bg text-gray-100 font-sans selection:bg-accent/30 selection:text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <Sidebar currentStep={step} setStep={setStep} stepsCompleted={stepsCompleted} />

      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-bg/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
          <div className="font-mono font-bold text-lg text-accent2 flex items-center gap-2">
            Soal<span className="text-white font-light">Gen</span> <span className="text-[10px] text-gray-500 bg-surface3 px-2 py-0.5 rounded border border-border">AI Beta</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{contextData.kurikulum}</span>
            <div className="h-4 w-[1px] bg-border"></div>
            <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded">Step {step}/5</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto h-full">
            {step === 1 && (
              <Step1Context 
                data={contextData} 
                updateData={handleUpdateContext} 
                onNext={advanceStep} 
              />
            )}
            {step === 2 && (
              <Step2CP 
                cpText={cpText} 
                setCpText={setCpText} 
                bloom={bloom} 
                setBloom={setBloom}
                totalSoal={totalSoal}
                onBack={goBack} 
                onNext={advanceStep} 
              />
            )}
            {step === 3 && (
                <Step3Kisi 
                    ctx={contextData}
                    cpText={cpText}
                    bloom={bloom}
                    kisiList={kisiList}
                    setKisiList={setKisiList}
                    onBack={goBack}
                    onNext={advanceStep}
                />
            )}
            {step === 4 && (
                <Step4Soal 
                    ctx={contextData}
                    kisiList={kisiList}
                    soalList={soalList}
                    setSoalList={setSoalList}
                    onBack={goBack}
                    onNext={advanceStep}
                />
            )}
            {step === 5 && (
                <Step5Export 
                    ctx={contextData}
                    kisiList={kisiList}
                    soalList={soalList}
                    onBack={goBack}
                />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;