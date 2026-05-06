import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, Fingerprint, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AIDetection = () => {
  const [input, setInput] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDetection = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setData(null);
    try {
      const response = await api.post('/tools/detect', { text: input });
      setData(response.data); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreData = (val) => {
    if (val > 0.7) return { text: 'Highly Likely AI', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertCircle };
    if (val > 0.3) return { text: 'Mixed / Edited', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle };
    return { text: 'Likely Human', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
  };

  return (
    <div className="p-8 md:p-16 max-w-7xl mx-auto w-full flex flex-col h-full bg-[#0B0F1A] premium-grid">
      <header className="mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-violet to-brand-indigo rounded-2xl flex items-center justify-center shadow-xl shadow-brand-violet/20 rotate-3 group hover:rotate-0 transition-transform duration-500">
            <Search className="text-white" size={28} />
          </div>
          <h2 className="text-5xl font-black text-brand-gray-primary tracking-tighter leading-tight">AI Content Auditor</h2>
        </div>
        <p className="text-brand-gray-secondary font-bold text-xl max-w-2xl relative z-10 leading-relaxed">
          Deeply analyze text structure, perplexity, and burstiness to predict origin and display forensic reasoning.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 flex-1">
        {/* Input */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray-muted">Document Signature</label>
            <span className="text-[10px] font-black text-brand-gray-muted uppercase tracking-widest">{input.split(/\s+/).filter(w => w.length > 0).length} Words</span>
          </div>
          <div className="flex-1 glass-panel glass-panel-hover border-white/10 rounded-[44px] shadow-2xl overflow-hidden group focus-within:ring-[20px] ring-brand-violet/5 focus-within:border-brand-violet/40 transition-all h-[450px] relative">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Fingerprint size={120} className="text-brand-violet" />
            </div>
            <textarea
              className="w-full h-full bg-transparent px-10 py-10 text-brand-gray-primary resize-none focus:outline-none placeholder:text-brand-gray-muted text-xl font-bold leading-relaxed relative z-10"
              placeholder="Paste document signature to audit..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button 
            onClick={handleDetection}
            disabled={!input.trim() || isLoading}
            className="premium-button h-20 shadow-2xl shadow-brand-violet/30 hover:scale-[1.02] active:scale-95 transition-all text-base tracking-[0.2em] uppercase"
          >
            {isLoading ? <Fingerprint size={28} className="animate-pulse" /> : <ShieldAlert size={28} />}
            {isLoading ? 'Running Forensic Audit...' : 'Execute Full System Scan'}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 flex flex-col">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray-muted mb-6 h-[20px]">Analysis Result</label>
          <div className="flex-1 glass-panel glass-panel-hover border-white/10 rounded-[44px] overflow-hidden shadow-2xl flex flex-col items-center justify-start relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-violet/10 rounded-full blur-[60px] -mr-20 -mt-20"></div>
            
            <AnimatePresence mode="wait">
              {data !== null ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full flex flex-col z-10"
                >
                  <div className="p-12 flex flex-col items-center text-center border-b border-white/10 bg-white/5 backdrop-blur-md">
                      <div className="text-9xl font-black mb-6 tracking-tighter text-brand-gray-primary">
                          {Math.round(data.score * 100)}<span className="text-4xl text-brand-gray-muted">%</span>
                      </div>
                      <div className={`flex items-center gap-3 px-8 py-3 rounded-full border-2 font-black uppercase tracking-[0.2em] text-xs shadow-lg ${getScoreData(data.score).bg} ${getScoreData(data.score).color} ${getScoreData(data.score).border}`}>
                        {React.createElement(getScoreData(data.score).icon, { size: 18 })}
                        {getScoreData(data.score).text}
                      </div>
                  </div>
                  
                  <div className="p-10 flex-1 flex flex-col">
                      <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-brand-gray-muted mb-8"><Info size={20}/> Forensic Evidence</h4>
                       <div className="glass-panel p-9 rounded-[40px] border-white/10 flex-1 relative italic text-brand-gray-secondary font-bold text-xl leading-relaxed shadow-inner">
                          <div className="absolute top-0 left-0 w-2 h-full bg-brand-violet/20 rounded-l-[40px]"></div>
                          "{data.explanation}"
                      </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-8 text-brand-gray-primary h-full w-full p-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-violet/20 blur-3xl animate-pulse"></div>
                    <Fingerprint size={120} strokeWidth={1} className="relative z-10 text-brand-gray-muted opacity-40" />
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 mb-4 animate-pulse-glow">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-brand-violet">Neural Standby</span>
                    </div>
                    <p className="font-black text-brand-gray-muted uppercase tracking-[0.4em] text-xs mb-3">Protocol Idle</p>
                    <p className="text-brand-gray-muted font-bold italic">Awaiting document signature for forensic audit.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIDetection;
