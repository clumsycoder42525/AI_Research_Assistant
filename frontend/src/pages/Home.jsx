import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, FileText, Search, ChevronRight, Sparkles, 
  Zap, ArrowRight, BookOpen, Clock, 
  BarChart3, Globe, Shield, Users, ZapIcon,
  Activity, Radio, Cpu
} from 'lucide-react';
import api from '../services/api';
import { 
  FeatureCard, HowItWorksStep, TestimonialCard, 
  StatItem, Footer, AIStatusIndicator, FloatingNode, Typewriter 
} from '../components/LandingComponents';

const Home = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const username = localStorage.getItem('username') || 'Scholar';

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await api.get('/history/chats');
        setHistory(res.data.slice(0, 3));
      } catch (e) {}
    };
    fetchHistory();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0B0F1A] overflow-x-hidden premium-grid">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Glows */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-brand-violet/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none animate-blob"></div>
        
        {/* Floating AI Elements */}
        <FloatingNode className="top-40 left-20" delay={0} duration={8} />
        <FloatingNode className="top-80 right-40" delay={2} duration={7} />
        <FloatingNode className="bottom-40 left-1/3" delay={4} duration={9} />

        <div className="max-w-7xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <AIStatusIndicator label="Quantum Neural Engine Online" status="online" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-brand-gray-primary mb-8 leading-[0.9]"
            >
              Research with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan">Autonomous AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-brand-gray-secondary max-w-xl font-bold leading-relaxed mb-12"
            >
              Scholar Shayak is a decentralized network of AI agents designed to evolve academic research, synthesis, and discovery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <button onClick={() => navigate('/research')} className="premium-button group h-16 px-10">
                Initialize Protocol <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/paraphraser')} className="secondary-button h-16">
                Docs & API
              </button>
            </motion.div>
          </div>

          {/* AI Live Preview Box */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-brand-violet/20 blur-[100px] rounded-full scale-110 animate-pulse-glow"></div>
            <div className="relative glass-panel rounded-[40px] border-white/20 overflow-hidden shadow-2xl p-1 bg-gradient-to-br from-white/10 to-transparent">
                <div className="bg-[#0F172A] rounded-[36px] p-8 min-h-[400px] flex flex-col relative overflow-hidden group/box">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/5 to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-1000"></div>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06] relative z-10">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-violet animate-pulse-glow" />
                      <span className="text-[10px] font-black text-brand-gray-muted uppercase tracking-widest">Neural Stream • Active</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6 relative z-10">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-violet/20 flex items-center justify-center text-brand-violet shrink-0">
                        <Cpu size={20} />
                      </div>
                      <div className="flex-1 bg-white/5 rounded-2xl rounded-tl-none p-4">
                        <p className="text-sm font-bold text-brand-gray-secondary">Initialize research node for "Regenerative Agriculture 2030"...</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-lime/20 flex items-center justify-center text-brand-lime shrink-0">
                        <Sparkles size={20} />
                      </div>
                      <div className="flex-1 bg-brand-violet/10 border border-brand-violet/20 rounded-2xl rounded-tl-none p-4">
                        <Typewriter 
                          text="Scanning global databases... Found 427 relevant papers. Synthesizing core insights and identifying methodology gaps. Protocol evolving." 
                          className="text-sm font-black text-slate-100 leading-relaxed" 
                          delay={1000} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/[0.06] flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                      <Radio size={14} className="text-brand-lime animate-pulse" />
                      <span className="text-[10px] font-black text-brand-lime uppercase tracking-widest">Live Sync</span>
                    </div>
                    <span className="text-[10px] font-black text-brand-gray-muted uppercase tracking-widest">Vedanta Core v4.0</span>
                  </div>
                </div>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-900 w-full col-span-1 lg:col-span-2 text-center"
          >
            <p className="text-[10px] font-black text-brand-gray-muted uppercase tracking-[0.4em] mb-8">Trusted by Researchers from</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale group-hover:grayscale-0 transition-all">
              <div className="font-black text-2xl tracking-tighter text-brand-gray-primary">VEDANTA</div>
              <div className="font-black text-2xl tracking-tighter text-brand-gray-primary">STANFORD</div>
              <div className="font-black text-2xl tracking-tighter text-brand-gray-primary">MIT</div>
              <div className="font-black text-2xl tracking-tighter text-brand-gray-primary">HARVARD</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem icon={Users} value="12k+" label="Active Scholars" delay={0.1} />
          <StatItem icon={Globe} value="150+" label="Institutions" delay={0.2} />
          <StatItem icon={ZapIcon} value="50ms" label="Response Latency" delay={0.3} />
          <StatItem icon={Shield} value="99.9%" label="Accuracy Node" delay={0.4} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-brand-violet uppercase tracking-[0.4em] mb-4">Core Protocols</h2>
            <h3 className="text-4xl md:text-5xl font-black text-brand-gray-primary tracking-tight">Everything you need to <br/> scale your intelligence.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Sparkles} 
              title="Research Sahayak" 
              desc="Multi-agent search nodes that crawl global databases to find the exact evidence you need."
              delay={0.1}
              onClick={() => navigate('/research')}
            />
            <FeatureCard 
              icon={Search} 
              title="AI Detection" 
              desc="Deep-layer forensic analysis to verify content authenticity with high-precision confidence scores."
              delay={0.2}
              isActive={true}
              onClick={() => navigate('/detection')}
            />
            <FeatureCard 
              icon={Zap} 
              title="Smart Paraphraser" 
              desc="Re-engineer sentences while preserving semantic meaning. Bypass detection with clean outputs."
              delay={0.3}
              onClick={() => navigate('/paraphraser')}
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 premium-grid pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-xs font-black text-brand-lime uppercase tracking-[0.4em] mb-4">Execution Flow</h2>
            <h3 className="text-4xl md:text-6xl font-black mb-12 tracking-tight">From hypothesis <br/> to paper in minutes.</h3>
            <div className="space-y-4">
              <HowItWorksStep step="01" title="Initialize Node" desc="Input your research topic or upload a base document to seed the intelligence engine." icon={Bot} delay={0.1} />
              <HowItWorksStep step="02" title="Multi-Agent Analysis" desc="Our agents (Searcher, Reviewer, Synthesizer) collaborate to extract deep insights." icon={Users} delay={0.2} />
              <HowItWorksStep step="03" title="Final Output" desc="Receive a structured, cited research report ready for academic submission." icon={FileText} delay={0.3} />
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-full aspect-square max-w-md bg-brand-violet/20 rounded-[60px] border border-white/10 relative animate-float">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-brand-violet rounded-full blur-[60px] animate-pulse"></div>
                    <Sparkles className="text-white relative z-10" size={120} strokeWidth={1} />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-10 -left-10 glass-panel p-6 rounded-3xl border-white/20 animate-blob">
                    <BarChart3 className="text-brand-lime" size={32} />
                </div>
                <div className="absolute -bottom-10 -right-10 glass-panel p-6 rounded-3xl border-white/20 animate-blob" style={{ animationDelay: '3s' }}>
                    <Shield className="text-brand-cyan" size={32} />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Integration (Recent History) */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-xs font-black text-brand-violet uppercase tracking-[0.4em] mb-4">Your Workspace</h2>
              <h3 className="text-4xl font-black text-brand-gray-primary tracking-tight">Welcome back, {username}. <br/> Continue where you left off.</h3>
            </div>
            <button onClick={() => navigate('/history')} className="flex items-center gap-3 px-8 py-4 rounded-[22px] bg-white/[0.04] border border-white/[0.08] text-brand-gray-primary text-xs font-black uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all shadow-xl group/btn">
              View All History <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate('/chat')} 
                    className="glass-panel glass-panel-hover p-6 flex items-center justify-between group rounded-[24px] cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-brand-gray-muted group-hover:bg-brand-violet group-hover:text-white transition-all duration-500">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h4 className="text-brand-gray-primary font-bold text-lg group-hover:text-brand-violet transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] text-brand-gray-muted font-black uppercase tracking-widest">Research Session</p>
                            <span className="w-1 h-1 rounded-full bg-white/[0.1]"></span>
                            <div className="flex items-center gap-1 text-[10px] text-brand-gray-muted font-black uppercase tracking-widest">
                                <Clock size={10} /> {new Date(item.created_at).toLocaleDateString()}
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center group-hover:bg-brand-violet group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="glass-panel p-20 text-center rounded-[32px]">
                   <Bot size={48} className="text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                   <p className="text-slate-400 font-bold">No active research nodes found. Start your first session to begin archiving.</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-brand-violet to-brand-indigo p-8 rounded-[40px] text-white relative overflow-hidden group shadow-2xl shadow-brand-violet/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                            <ZapIcon size={24} className="text-brand-lime" />
                        </div>
                        <h3 className="text-2xl font-black mb-4 tracking-tight">Prime Access</h3>
                        <p className="text-white/70 font-bold text-sm leading-relaxed mb-8">Unlock unlimited multi-agent depth, priority processing, and white-label research reports.</p>
                        <button onClick={() => navigate('/settings')} className="w-full py-4 rounded-2xl bg-white text-brand-violet font-black text-xs uppercase tracking-widest hover:bg-brand-lime hover:text-brand-dark transition-all">Upgrade Node</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-brand-violet uppercase tracking-[0.4em] mb-4">Scholar Feedback</h2>
            <h3 className="text-4xl md:text-5xl font-black text-brand-gray-primary tracking-tight">Trusted by the brightest minds.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Dr. Aris" 
              role="Senior Researcher" 
              feedback="The multi-agent system found citations I missed after weeks of manual search. It's like having a team of research assistants available 24/7."
              delay={0.1}
            />
            <TestimonialCard 
              name="Sarah Chen" 
              role="PhD Candidate" 
              feedback="Scholar Shayak has halved my literature review time. The paraphraser is also incredibly clean and maintains academic tone perfectly."
              delay={0.2}
            />
            <TestimonialCard 
              name="James Wilson" 
              role="Technical Writer" 
              feedback="The UI is so clean and the speed is unmatched. I use the AI detection node to verify all my sources before publication."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto glass-panel p-16 rounded-[60px] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
          
          <h3 className="text-4xl md:text-6xl font-black text-brand-gray-primary tracking-tighter mb-8 leading-tight">Ready to evolve your <br/> research protocol?</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <button onClick={() => navigate('/auth')} className="premium-button">Join the Network</button>
            <button onClick={() => navigate('/research')} className="px-8 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-brand-gray-primary font-black text-xs uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all">Start Free Session</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
