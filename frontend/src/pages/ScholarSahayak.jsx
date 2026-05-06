import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, Download, FileText, 
  BookOpen, Globe, Search, Zap, MessageSquare, 
  Map, Lightbulb, CheckCircle2, Loader2, Info,
  Mic, MicOff, Volume2, StopCircle, Activity, Radio, Shield
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { ensureString } from '../utils/renderUtils';

const AgentStep = ({ name, icon: Icon, color, status, isActive, isCompleted }) => {
  const isViolet = color === 'brand-violet' || !color;
  const isCyan = color === 'brand-cyan';
  const isOrange = color === 'orange-500' || color === 'amber-500';
  const isEmerald = color === 'emerald-500';

  return (
    <div className={`flex items-center gap-3 py-3 px-4 rounded-2xl transition-all ${isActive ? 'bg-brand-violet/10 border border-brand-violet/20' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${
        isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
        isActive ? 'bg-brand-violet border-brand-violet text-white animate-pulse' : 
        'bg-white/[0.03] border-white/[0.08] text-brand-gray-muted'
      }`}>
        {isCompleted ? <CheckCircle2 size={16} /> : isActive ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={14} /> : <div className="w-2 h-2 rounded-full bg-current" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isActive ? 'text-brand-violet' : isCompleted ? 'text-emerald-400' : 'text-brand-gray-secondary'}`}>
          {name}
        </p>
        {isActive && <p className="text-[10px] text-brand-violet/60 font-bold truncate animate-pulse uppercase tracking-wider">{status}</p>}
      </div>
    </div>
  );
};

const ScholarSahayak = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [researchMode, setResearchMode] = useState('deep'); 
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [agentStatus, setAgentStatus] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const steps = [
    { name: "Literature Finder", icon: Search, color: "brand-violet" },
    { name: "Summarizer", icon: FileText, color: "brand-cyan" },
    { name: "Critical Analyzer", icon: Zap, color: "amber-500" },
    { name: "Idea Generator", icon: Lightbulb, color: "emerald-500" },
    { name: "Citation Expert", icon: BookOpen, color: "brand-violet" },
    { name: "Final Refiner", icon: Sparkles, color: "brand-violet" }
  ];

  const modes = [
    { id: 'quick', label: 'Quick Scan', icon: Zap, color: 'brand-cyan' },
    { id: 'deep', label: 'Deep Research', icon: Sparkles, color: 'brand-violet' },
    { id: 'debate', label: 'Debate Mode', icon: MessageSquare, color: 'orange-500' },
    { id: 'gap', label: 'Gap Finder', icon: Map, color: 'emerald-500' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => scrollToBottom(), [messages, agentStatus]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, mode: researchMode }]);
    setIsLoading(true);
    setCurrentStep(0);
    setAgentStatus('Initializing Shayak Protocol...');

    try {
      let stepIdx = 0;
      const progressInterval = setInterval(() => {
        if (stepIdx < steps.length) {
          setCurrentStep(stepIdx);
          setAgentStatus(`${steps[stepIdx].name} is processing...`);
          stepIdx++;
        } else {
          clearInterval(progressInterval);
        }
      }, 4000);

      const response = await api.post('/scholar/deep-research', {
        prompt: userMsg,
        mode: researchMode
      });

      clearInterval(progressInterval);
      setCurrentStep(steps.length);
      setAgentStatus('Research complete.');

      const report = response.data?.final_report || null;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        is_report: true, 
        report,
        mode: researchMode
      }]);

    } catch (error) {
      console.error("Scholar error", error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Our research node is currently busy or the pipeline timed out. Please try again with a more specific query.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech Recognition not supported in this browser.");
        return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Optional: auto-submit or let user review
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleSpeakReport = (report) => {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
    }

    const textToSpeak = `
        Research topic: ${report.topic}. 
        Abstract: ${report.abstract}. 
        Key Insights: ${report.key_insights}. 
        Conclusion: ${report.final_summary}.
    `.replace(/[#*_]/g, '');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('research-report');
    if (!element) return;

    // Dynamically load html2pdf.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
        const opt = {
            margin: 10,
            filename: `ScholarResearch_${new Date().getTime()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        window.html2pdf().from(element).set(opt).save();
    };
    document.body.appendChild(script);
  };

  return (
    <div className="flex h-full w-full bg-[#0B0F1A] transition-colors duration-300 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full border-r border-white/[0.08]">
        <header className="px-10 py-5 border-b border-white/[0.08] bg-[#0B0F1A]/80 backdrop-blur-md flex justify-between items-center shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-lime flex items-center justify-center shadow-lg shadow-brand-lime/20 rotate-3">
              <Sparkles className="text-brand-dark" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-brand-gray-primary tracking-tight leading-none">Scholar Shayak</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-brand-gray-muted font-bold uppercase tracking-widest">Multi-Agent System Active</p>
              </div>
            </div>
          </div>

          <div className="flex bg-white/[0.02] p-1.5 rounded-[22px] border border-white/[0.06] backdrop-blur-sm shadow-sm">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setResearchMode(m.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-xs font-black transition-all duration-500 ${
                  researchMode === m.id 
                  ? `bg-white/[0.06] text-brand-violet shadow-md scale-[1.02] border border-white/[0.08]` 
                  : 'text-brand-gray-muted hover:text-brand-gray-primary'
                }`}
              >
                <m.icon size={14} className={researchMode === m.id ? 'text-brand-violet' : ''} /> {m.label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-16 scroll-smooth premium-grid">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
              >
                <div className="relative mb-14">
                  <div className="absolute inset-0 bg-brand-violet/20 blur-[120px] rounded-full scale-150 animate-pulse-glow"></div>
                  <div className="w-32 h-32 rounded-[44px] bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center shadow-2xl relative z-10 rotate-6 group">
                    <Search size={56} className="text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 glass-panel p-3 rounded-2xl animate-bounce">
                    <Sparkles className="text-brand-lime" size={24} />
                  </div>
                </div>
                
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel border-white/10 mb-10 shadow-lg shadow-brand-violet/5 animate-float">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 blur-sm rounded-full animate-pulse"></div>
                      <span className="relative flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-[10px] font-black text-brand-gray-primary uppercase tracking-[0.4em]">Neural Core Standby • Protocol Idle</span>
                </div>

                <h3 className="text-5xl md:text-6xl font-black text-brand-gray-primary mb-8 tracking-tighter leading-tight">
                  Evolve your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan italic">Academic Discovery</span>
                </h3>
                
                <p className="text-brand-gray-secondary text-xl font-bold leading-relaxed mb-16 opacity-80">
                  Our autonomous agents scan global literature, synthesize multi-layer insights, and map methodology gaps in real-time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {[
                    { topic: 'Quantum Computing Gaps', icon: Zap },
                    { topic: 'Regenerative Agriculture 2030', icon: Globe },
                    { topic: 'AI Ethics in Medicine', icon: Shield },
                    { topic: 'Global Water Solutions', icon: Activity }
                  ].map(item => (
                    <button 
                      key={item.topic}
                      onClick={() => setInput(item.topic)}
                      className="p-8 rounded-[40px] glass-panel glass-panel-hover border-white/10 text-left group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/5 rounded-full blur-[40px] -mr-12 -mt-12 group-hover:bg-brand-violet/10 transition-colors"></div>
                      <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 flex items-center justify-center text-brand-violet mb-4 group-hover:scale-110 transition-transform">
                        <item.icon size={24} />
                      </div>
                      <p className="text-[10px] text-brand-violet font-black mb-2 uppercase tracking-widest opacity-60">Research Node</p>
                      <p className="text-xl font-black text-brand-gray-primary group-hover:text-brand-violet transition-colors truncate">{item.topic}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-8 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl shrink-0 transition-transform hover:scale-110 ${
                    msg.role === 'user' ? 'bg-brand-violet border-brand-violet text-white' : 'bg-white/[0.04] border-white/[0.08] text-brand-violet'
                  }`}>
                    {msg.role === 'user' ? <User size={24} /> : <Sparkles size={24} />}
                  </div>
                  
                  <div className={`px-10 py-9 rounded-[40px] transition-all relative overflow-hidden glass-panel glass-panel-hover ${
                    msg.is_report 
                    ? 'border-white/20 shadow-2xl w-full' 
                    : msg.role === 'user' 
                      ? 'bg-gradient-to-br from-brand-violet to-brand-indigo text-white shadow-xl shadow-brand-violet/20 font-black text-xl leading-relaxed border border-white/10' 
                      : 'border-white/10 text-brand-gray-primary text-xl font-medium leading-relaxed shadow-lg'
                  }`}>
                    {msg.role === 'assistant' && !msg.is_report && (
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Activity size={40} className="text-brand-violet animate-pulse-glow" />
                        </div>
                    )}
                    {msg.is_report ? (
                      <div id="research-report" className="space-y-12">
                        {msg.report ? (
                          <>
                            <div className="flex justify-between items-start border-b border-white/[0.08] pb-8">
                              <div>
                                <h4 className="text-4xl font-black text-brand-gray-primary tracking-tight leading-tight mb-3 capitalize">{msg.report?.topic || 'Research Synthesis'}</h4>
                                <div className="flex gap-4 items-center">
                                    <p className="text-xs text-brand-violet font-black tracking-widest uppercase bg-brand-violet/5 px-3 py-1 rounded-full border border-brand-violet/10">Deep-Scan Agentic Analytics</p>
                                    <span className="text-[10px] text-brand-gray-muted font-bold uppercase tracking-widest pl-2 border-l border-white/[0.06]">Protocol: {msg.mode || 'Deep'}</span>
                                </div>
                              </div>
                              <div className="flex gap-3 no-print">
                                <button 
                                    onClick={() => handleSpeakReport(msg.report)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all hover:shadow-xl active:scale-95 border ${
                                            isSpeaking 
                                        ? 'bg-red-500 text-white border-red-500' 
                                        : 'bg-white/[0.04] text-brand-gray-primary border-white/[0.08]'
                                    }`}
                                >
                                    {isSpeaking ? <StopCircle size={16}/> : <Volume2 size={16}/>} {isSpeaking ? 'Stop Listening' : 'Listen Report'}
                                </button>
                                <button 
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-gray-primary text-navy-950 font-black text-xs hover:bg-brand-gray-primary/90 transition-all hover:shadow-xl active:scale-95"
                                >
                                    <Download size={16}/> Save PDF
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-lime text-brand-dark font-black text-xs hover:shadow-xl transition-all active:scale-95 border border-brand-lime shadow-lg shadow-brand-lime/20">
                                    <BookOpen size={16}/> Full Review
                                </button>
                              </div>
                            </div>

                            {msg.report?.abstract && (
                              <div className="bg-white/[0.02] p-10 rounded-[48px] border border-white/[0.08] shadow-inner relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-brand-violet/20 group-hover:bg-brand-violet transition-colors"></div>
                                <h5 className="flex items-center gap-3 text-xs font-black text-brand-violet uppercase tracking-[0.2em] mb-8"><FileText size={20}/> Executive Abstract</h5>
                                <div className="text-brand-gray-primary leading-relaxed text-2xl font-bold tracking-tight px-2">
                                  {msg.report.abstract}
                                </div>
                              </div>
                            )}

                            {msg.report?.final_summary && (
                              <div className="bg-brand-violet/5 p-10 rounded-[48px] border border-brand-violet/10 shadow-sm">
                                <h5 className="flex items-center gap-3 text-xs font-black text-brand-violet uppercase tracking-[0.2em] mb-8"><Sparkles size={20}/> Refined Conclusion</h5>
                                <div className="text-brand-gray-primary italic leading-relaxed text-xl font-bold px-2 relative">
                                  <span className="absolute -left-4 top-0 text-brand-violet/20 text-6xl">"</span>
                                  {msg.report.final_summary}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              {msg.report?.key_insights && (
                                <section className="group">
                                  <h5 className="flex items-center gap-3 text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-8 group-hover:translate-x-2 transition-transform"><CheckCircle2 size={20}/> Core Insights</h5>
                                  <div className="bg-emerald-500/5 p-9 rounded-[42px] border border-emerald-500/10 prose prose-invert max-w-none prose-p:text-emerald-200 prose-p:font-bold prose-p:text-lg shadow-sm">
                                      <ReactMarkdown>{ensureString(msg.report.key_insights)}</ReactMarkdown>
                                  </div>
                                </section>
                              )}
                              {msg.report?.research_gaps && (
                                <section className="group">
                                  <h5 className="flex items-center gap-3 text-xs font-black text-amber-600 uppercase tracking-[0.2em] mb-8 group-hover:translate-x-2 transition-transform"><Lightbulb size={20}/> Identified Gaps</h5>
                                  <div className="bg-amber-500/5 p-9 rounded-[42px] border border-amber-500/10 prose prose-invert max-w-none prose-p:text-amber-200 prose-p:font-bold prose-p:text-lg shadow-sm">
                                      <ReactMarkdown>{ensureString(msg.report.research_gaps)}</ReactMarkdown>
                                  </div>
                                </section>
                              )}
                            </div>

                            {(msg.report?.pro_arguments || msg.report?.con_arguments) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                                {msg.report?.pro_arguments && (
                                  <section className="group">
                                    <h5 className="flex items-center gap-3 text-xs font-black text-brand-violet uppercase tracking-[0.2em] mb-8 group-hover:translate-x-2 transition-transform"><Sparkles size={20}/> Arguments in Favour</h5>
                                    <div className="bg-brand-violet/5 p-9 rounded-[42px] border border-brand-violet/10 shadow-sm prose prose-invert max-w-none prose-p:text-brand-gray-primary prose-p:font-bold prose-p:text-lg">
                                        <ReactMarkdown>{ensureString(msg.report.pro_arguments)}</ReactMarkdown>
                                    </div>
                                  </section>
                                )}
                                {msg.report?.con_arguments && (
                                  <section className="group">
                                    <h5 className="flex items-center gap-3 text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-8 group-hover:translate-x-2 transition-transform"><Zap size={20}/> Arguments Against</h5>
                                    <div className="bg-red-500/5 p-9 rounded-[42px] border border-red-500/10 shadow-sm prose prose-invert max-w-none prose-p:text-red-200 prose-p:font-bold prose-p:text-lg">
                                        <ReactMarkdown>{ensureString(msg.report.con_arguments)}</ReactMarkdown>
                                    </div>
                                  </section>
                                )}
                              </div>
                            )}

                            {msg.report?.citations && (
                              <section className="bg-white/[0.03] p-10 rounded-[48px] border border-white/[0.08] shadow-xl">
                                <h5 className="flex items-center gap-3 text-xs font-black text-brand-gray-muted uppercase tracking-[0.3em] mb-10"><BookOpen size={20}/> Academic Bibliography & Citations</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                  {['apa', 'mla', 'ieee'].map(style => (
                                    <div key={style} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-brand-violet/20 transition-all shadow-sm">
                                      <p className="text-[10px] font-black text-brand-violet uppercase mb-4 tracking-widest underline decoration-2 underline-offset-4 decoration-brand-violet/30">{style} Format</p>
                                      <div className="text-[12px] text-brand-gray-secondary font-mono leading-relaxed space-y-4 italic mt-2">
                                          {msg.report.citations && msg.report.citations[style] && Array.isArray(msg.report.citations[style]) && msg.report.citations[style].length > 0 ? (
                                            msg.report.citations[style].map((c, idx) => <p key={idx} className="hover:text-brand-violet transition-colors">{ensureString(c)}</p>)
                                          ) : (
                                            <p className="opacity-50">No {style} citations available for this scan.</p>
                                          )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-16 text-brand-gray-muted">
                            <Bot size={56} className="mb-6 opacity-10" />
                            <p className="font-bold text-xl text-center">Research report could not be synthesized.<br/><span className="text-sm font-medium opacity-60">Please try again with a more specific query.</span></p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="prose prose-slate max-w-none prose-p:my-2 prose-ol:my-2 prose-p:font-bold">
                        <ReactMarkdown>{ensureString(msg.content)}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-32" />
        </div>

        {/* Floating Input Area */}
        <div className="px-10 pb-10 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/90 to-transparent">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto relative group">
            <div className="flex flex-col glass-panel rounded-[44px] px-3 pt-3 pb-3 border-white/10 focus-within:ring-[20px] ring-brand-violet/5 focus-within:border-brand-violet/40 transition-all duration-700 shadow-2xl relative overflow-hidden group/input">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-violet/5 via-transparent to-brand-indigo/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000"></div>
              <div className="flex items-center px-8 py-3 justify-between border-b border-white/[0.08] mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-violet animate-pulse"></div>
                    <p className="text-[10px] font-black text-brand-gray-muted uppercase tracking-[0.2em]">Active Protocol: <span className="text-brand-violet">{researchMode}</span></p>
                    <div className="ml-6 flex items-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                        <Activity size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural Link v4.0 Active</span>
                    </div>
                </div>
                <div className="flex gap-5">
                   <button type="button" className="text-brand-gray-muted hover:text-brand-violet transition-all transform hover:scale-110"><Globe size={18}/></button>
                   <button type="button" className="text-brand-gray-muted hover:text-brand-violet transition-all transform hover:scale-110"><Lightbulb size={18}/></button>
                </div>
              </div>
              <div className="flex p-3 items-center gap-4">
                <button 
                  type="button" 
                  onClick={isListening ? stopListening : startListening}
                  className={`w-16 h-16 rounded-[28px] flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 text-white animate-pulse shadow-xl shadow-red-500/20' : 'bg-white/[0.04] text-brand-gray-muted hover:bg-white/[0.08]'
                  }`}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Ask Shayak to deep-research any academic topic..."}
                  className="flex-1 bg-transparent px-4 py-6 text-brand-gray-primary focus:outline-none placeholder:text-brand-gray-muted text-2xl font-bold tracking-tight"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-20 h-20 rounded-[34px] bg-brand-violet text-white flex items-center justify-center hover:bg-brand-violet/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 shadow-2xl shadow-brand-violet/30 rotate-3 group-hover:rotate-0"
                >
                  {isLoading ? <Loader2 size={32} className="animate-spin" /> : <Send size={32} />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Side Orchestrator Status */}
      <div className="w-96 flex flex-col p-10 bg-[#0B121E]/70 backdrop-blur-3xl hidden xl:flex border-l border-white/[0.08]">
        <div className="flex items-center gap-4 mb-14">
           <div className="w-10 h-10 rounded-xl bg-brand-violet/10 flex items-center justify-center text-brand-violet border border-brand-violet/20">
                <Zap size={22} />
           </div>
           <div>
               <h4 className="text-xs font-black text-brand-gray-primary uppercase tracking-[0.3em] leading-none">Orchestrator Logs</h4>
               <p className="text-[9px] font-bold text-brand-gray-muted uppercase tracking-widest mt-1.5">Live Pipeline Status</p>
           </div>
        </div>
        
        <div className="space-y-4 flex-1">
          {steps.map((step, i) => (
            <AgentStep 
              key={step.name}
              name={step.name}
              icon={step.icon}
              color={step.color}
              status={agentStatus}
              isActive={isLoading && currentStep === i}
              isCompleted={currentStep > i}
            />
          ))}
        </div>

        <div className="mt-14">
          <div className="p-8 rounded-[48px] bg-white/[0.02] border border-white/[0.06] relative overflow-hidden group shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-brand-gray-primary uppercase tracking-[0.2em] relative z-10">Compute Cluster</p>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="h-2.5 w-full bg-white/[0.04] rounded-full overflow-hidden shadow-inner p-0.5">
                 <motion.div initial={{ width: 0 }} animate={{ width: isLoading ? '92%' : '18%' }} transition={{ duration: 1 }} className="h-full bg-brand-violet rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-black text-brand-gray-muted uppercase tracking-tighter">
                <span className="opacity-60">System Load</span>
                <span className="text-brand-violet font-black">{isLoading ? '92%' : '18%'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* PDF Styles Wrapper - Specific for html2pdf */}
      <style>{`
        @media print {
            .no-print { display: none !important; }
            #research-report { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default ScholarSahayak;
