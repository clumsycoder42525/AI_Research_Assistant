import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Wand2, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Paraphrasing = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState('Academic');

  const handleParaphrase = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const response = await api.post('/tools/paraphrase', { text: input, tone: tone });
      setOutput(response.data.paraphrased_text);
    } catch (error) {
      console.error(error);
      setOutput("Error processing request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-16 max-w-7xl mx-auto w-full min-h-screen flex flex-col bg-[#0B0F1A] premium-grid">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-violet to-brand-indigo rounded-2xl flex items-center justify-center shadow-xl shadow-brand-violet/20 rotate-3">
                  <FileText className="text-white" size={28} />
              </div>
              <h2 className="text-5xl font-black text-brand-gray-primary tracking-tighter leading-tight">AI Paraphraser</h2>
            </div>
            <p className="text-brand-gray-secondary font-bold text-xl max-w-2xl relative z-10 leading-relaxed">
            Humanize and adapt content intelligently to fit any stylistic requirement and bypass forensic detection.
            </p>
        </div>
        
        {/* Tone Selector */}
        <div className="glass-panel border-white/10 rounded-[28px] p-2 flex items-center shadow-xl z-10">
            {['Academic', 'Formal', 'Casual'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-8 py-3 rounded-[22px] text-xs font-black transition-all duration-500 ${tone === t ? 'bg-brand-violet text-white shadow-xl shadow-brand-violet/30 scale-[1.05]' : 'text-brand-gray-muted hover:text-brand-gray-primary hover:bg-white/[0.04]'}`}
                >
                    {t}
                </button>
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        {/* Input */}
        <div className="flex flex-col h-[600px] glass-panel glass-panel-hover border-white/10 rounded-[44px] shadow-2xl overflow-hidden group focus-within:ring-[20px] ring-brand-violet/5 focus-within:border-brand-violet/40 transition-all relative">
            <div className="px-10 py-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
              <span className="font-black text-brand-gray-muted text-[10px] tracking-[0.3em] uppercase">Input Protocol</span>
              <span className="text-[10px] font-black text-brand-gray-muted uppercase tracking-widest opacity-60">{input.length} Tokens</span>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent px-10 py-10 text-brand-gray-primary resize-none focus:outline-none placeholder:text-brand-gray-muted text-xl font-bold leading-relaxed relative z-10"
              placeholder="Paste raw content node here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="p-6 bg-white/5 border-t border-white/10">
              <button 
                onClick={handleParaphrase}
                disabled={!input.trim() || isLoading}
                className="premium-button h-20 shadow-2xl shadow-brand-violet/30 hover:scale-[1.02] active:scale-95 transition-all text-base tracking-[0.2em] uppercase"
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Wand2 size={28} />
                  </motion.div>
                ) : <Wand2 size={28} />}
                {isLoading ? 'Synthesizing...' : 'Execute Humanize Node'}
              </button>
            </div>
        </div>

        {/* Output */}
        <div className="flex flex-col h-[600px] glass-panel glass-panel-hover border-white/10 rounded-[44px] shadow-2xl overflow-hidden relative">
            <div className="px-10 py-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
              <span className="font-black text-brand-gray-muted text-[10px] tracking-[0.3em] uppercase">Synthesized Output</span>
              {output && <div className="px-4 py-1 bg-brand-lime text-brand-dark rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-lime/20 animate-pulse">Node Ready</div>}
            </div>
            <div className="flex-1 w-full p-10 overflow-y-auto">
              {output ? (
                <div className="text-brand-gray-primary leading-relaxed glass-panel p-10 rounded-[40px] border-white/10 text-xl font-bold relative italic shadow-inner">
                  <div className="absolute top-0 left-0 w-2 h-full bg-brand-violet/40 rounded-l-[40px]"></div>
                  "{output}"
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-brand-gray-primary gap-8 p-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-violet/20 blur-3xl animate-pulse"></div>
                    <FileText size={120} strokeWidth={1} className="relative z-10 text-brand-gray-muted opacity-40" />
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 mb-4 animate-pulse-glow">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-brand-violet">Neural Standby</span>
                    </div>
                    <p className="font-black text-brand-gray-muted uppercase tracking-[0.4em] text-xs mb-3">Protocol Idle</p>
                    <p className="text-brand-gray-muted font-bold italic">Awaiting content node for synthesis.</p>
                  </div>
                </div>
              )}
            </div>
            {output && (
                <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end">
                    <button 
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="px-10 py-4 rounded-[22px] bg-brand-gray-primary text-navy-950 font-black text-xs uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all shadow-xl"
                    >
                        Copy to Node Clipboard
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Paraphrasing;
