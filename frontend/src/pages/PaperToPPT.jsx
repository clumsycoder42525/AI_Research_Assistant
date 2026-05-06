import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Download, Layout, Search, 
  Sparkles, Loader2, CheckCircle2, AlertCircle 
} from 'lucide-react';
import api from '../services/api';

const PaperToPPT = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [slides, setSlides] = useState(null);
  const [error, setError] = useState(null);

  const generateSlides = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setSlides(null);

    try {
      const response = await api.post('/scholar/generate-slides', { prompt: topic });
      setSlides(response.data.slides);
    } catch (err) {
      console.error("Slide generation failed", err);
      setError("Failed to architect your slides. Please try a different topic.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPPT = () => {
    if (!slides || !Array.isArray(slides)) return;

    // Dynamically load pptxgenjs
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
    script.onload = () => {
        try {
            const PptxGenJS = window.PptxGenJS;
            let pptx = new PptxGenJS();
            
            pptx.title = "Scholar Shayak Research Deck";
            pptx.subject = topic;

            // 1. Dedicated Title Slide
            let titleSlide = pptx.addSlide();
            titleSlide.background = { color: "8B5CF6" }; // Brand Violet
            titleSlide.addText(topic, { 
                x: 1, y: 2, w: "80%", h: 1.5,
                fontSize: 44, bold: true, color: "FFFFFF", align: "center"
            });
            titleSlide.addText("AI-Generated Research Presentation", { 
                x: 1, y: 3.5, w: "80%", h: 0.5,
                fontSize: 20, color: "E2E8F0", align: "center"
            });
            titleSlide.addText("Powered by Scholar Shayak", { 
                x: 1, y: 5, w: "80%", h: 0.5,
                fontSize: 14, color: "FFFFFF", align: "center"
            });

            // 2. Content Slides
            slides.forEach((slide) => {
                let s = pptx.addSlide();
                
                // Header underline
                s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.4, w: 9, h: 0.03, fill: { color: "8B5CF6" } });
                
                s.addText(slide.title, { 
                    x: 0.5, y: 0.5, w: "90%", h: 0.8, 
                    fontSize: 32, bold: true, color: "1E293B"
                });
                
                if (slide.content && Array.isArray(slide.content)) {
                    s.addText(
                        slide.content.map(text => `• ${text}`).join("\n"), 
                        { 
                            x: 0.5, y: 1.8, w: "90%", h: 4, 
                            fontSize: 18, color: "475569",
                            lineSpacing: 28,
                            valign: "top"
                        }
                    );
                }
                
                // Footer
                s.addText("© Scholar Shayak AI | Private & Academic Use Only", { 
                    x: 0.5, y: 5.2, w: "90%", h: 0.3,
                    fontSize: 10, color: "94A3B8", align: "center"
                });
            });

            pptx.writeFile({ fileName: `Scholar_Research_${topic.substring(0, 20).replace(/\s/g, '_')}.pptx` });
        } catch (err) {
            console.error("PPT Export Error", err);
            alert("Something went wrong during PPT export. Please try again.");
        }
    };
    script.onerror = () => alert("Failed to load presentation engine. Please check your internet connection.");
    document.body.appendChild(script);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0F1A] relative overflow-y-auto pb-32 premium-grid">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-violet/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-8 pt-16 relative z-10">
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-violet/10 border border-white/10 text-brand-violet text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Layout size={12} /> Slide Architect Alpha
          </motion.div>
          <h1 className="text-5xl font-black text-brand-gray-primary tracking-tighter mb-4">Paper to <span className="text-brand-violet">PPT</span> Converter</h1>
          <p className="text-brand-gray-secondary text-lg font-bold max-w-2xl">Transform your research topics or paper abstracts into professional presentation decks in seconds.</p>
        </header>

        <form onSubmit={generateSlides} className="mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-violet/5 blur-[40px] rounded-full scale-110 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex bg-white/[0.03] backdrop-blur-xl p-3 rounded-[32px] border border-white/10 shadow-2xl focus-within:border-brand-violet focus-within:ring-8 ring-brand-violet/5 transition-all">
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Paste your abstract or type a research topic..."
                className="flex-1 bg-transparent px-6 py-4 text-xl font-bold text-brand-gray-primary focus:outline-none placeholder:text-brand-gray-muted"
              />
              <button 
                disabled={isLoading || !topic.trim()}
                className="px-8 py-4 rounded-2xl bg-brand-violet text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-brand-violet/30"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isLoading ? "Architecting..." : "Generate Deck"}
              </button>
            </div>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-400 font-bold mb-12"
            >
              <AlertCircle size={24} /> {error}
            </motion.div>
          )}

          {slides && (
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
              <div className="flex justify-between items-center glass-panel p-8 rounded-[40px] border border-white/10 shadow-xl">
                 <div>
                    <h3 className="text-2xl font-black text-brand-gray-primary tracking-tight">Slide Architecture Complete</h3>
                    <p className="text-sm font-bold text-brand-gray-muted mt-1 uppercase tracking-widest">Calculated {slides.length} Sequential Nodes</p>
                 </div>
                 <button 
                    onClick={handleDownloadPPT}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-gray-primary text-[#0B0F1A] font-black text-xs uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all hover:shadow-2xl active:scale-95 shadow-xl"
                 >
                    <Download size={18} /> Download .PPTX
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(slides) && slides.map((slide, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="aspect-[16/9] glass-panel rounded-[32px] border border-white/10 shadow-lg overflow-hidden flex flex-col group hover:border-brand-violet transition-colors"
                  >
                    <div className="h-8 bg-brand-violet/10 flex items-center px-6 justify-between border-b border-white/[0.08]">
                        <span className="text-[8px] font-black text-brand-violet uppercase tracking-widest">Slide {idx + 1}</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.1]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.1]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.1]"></div>
                        </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                        <h4 className="text-base font-black text-brand-gray-primary mb-4 tracking-tight leading-tight group-hover:text-brand-violet transition-colors">{slide.title}</h4>
                        <div className="space-y-3">
                            {slide.content && slide.content.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-lime mt-1.5 shrink-0"></div>
                                    <p className="text-[10px] font-bold text-brand-gray-secondary leading-relaxed overflow-hidden text-ellipsis line-clamp-2">{item}</p>
                                </div>
                            ))}
                            {slide.content?.length > 3 && <p className="text-[8px] font-black text-brand-gray-muted italic pl-5">+ {slide.content.length - 3} more points</p>}
                        </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-brand-violet/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>
                    <Loader2 size={64} className="text-brand-violet animate-spin relative z-10" />
                </div>
                <h3 className="text-2xl font-black text-brand-gray-primary mb-2">Architecting Presentation...</h3>
                <p className="text-brand-gray-muted font-bold uppercase tracking-widest text-[10px]">Scanning Literature & Structuring Visual Flow</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default PaperToPPT;
