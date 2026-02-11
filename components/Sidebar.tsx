import React from 'react';
import { AppStep } from '../types';

interface SidebarProps {
  currentStep: AppStep;
  setStep: (step: AppStep) => void;
  stepsCompleted: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, setStep, stepsCompleted }) => {
  const steps = [
    { id: 1, label: 'Konteks Asesmen', sub: 'Mapel, kelas, jenis' },
    { id: 2, label: 'CP/TP & Distribusi', sub: 'Tujuan, Bloom, KK' },
    { id: 3, label: 'Kisi-Kisi', sub: 'Generate & review' },
    { id: 4, label: 'Butir Soal', sub: 'Generate & validasi' },
    { id: 5, label: 'Review & Export', sub: 'Final & download' },
  ];

  return (
    <nav className="w-60 min-w-[240px] bg-white border-r border-border py-6 hidden md:block overflow-y-auto">
      <div className="px-5 mb-4 text-[10px] text-gray-600 uppercase tracking-widest font-mono font-bold">
        Alur Kerja
      </div>
      
      <div className="flex flex-col gap-1">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = step.id < stepsCompleted || (step.id < currentStep);
          
          return (
            <button
              key={step.id}
              onClick={() => step.id <= stepsCompleted + 1 ? setStep(step.id as AppStep) : null}
              disabled={step.id > stepsCompleted + 1}
              className={`
                flex items-center gap-3 px-5 py-3 w-full text-left transition-all relative
                ${isActive ? 'bg-emerald-50 border-r-2 border-accent' : 'hover:bg-slate-50 border-r-2 border-transparent'}
                ${step.id > stepsCompleted + 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div 
                className={`
                  w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold border transition-colors
                  ${isActive 
                    ? 'bg-accent border-accent2 text-white' 
                    : isDone 
                      ? 'bg-success border-success text-white'
                      : 'bg-white border-border text-gray-500'}
                `}
              >
                {step.id}
              </div>
              <div className="flex-1">
                <div className={`text-xs font-bold leading-tight ${isActive ? 'text-accent' : 'text-gray-900'}`}>
                  {step.label}
                </div>
                <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                  {step.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;