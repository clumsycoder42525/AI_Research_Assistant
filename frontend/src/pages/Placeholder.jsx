import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, AlertCircle, Info, Phone } from 'lucide-react';

const Placeholder = ({ title, desc, icon: Icon = Info, badge = "Coming Soon" }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8 bg-[#0B0F1A] premium-grid">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full glass-panel p-12 rounded-[60px] text-center relative overflow-hidden shadow-2xl border-white/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-brand-violet/10 flex items-center justify-center text-brand-violet mx-auto mb-8 shadow-xl shadow-brand-violet/10 border border-brand-violet/20">
            <Icon size={40} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-violet/10 text-brand-violet mb-6 text-[10px] font-black uppercase tracking-widest border border-brand-violet/20">
            <Sparkles size={12} className="text-brand-violet" /> {badge}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-brand-gray-primary mb-6 tracking-tighter">
            {title}
          </h1>

          <p className="text-brand-gray-secondary font-bold text-lg mb-10 leading-relaxed">
            {desc}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="premium-button flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <button 
              onClick={() => navigate('/research')}
              className="px-8 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-brand-gray-primary font-black text-sm uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all shadow-xl"
            >
              Explore Protocol
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const DocsPage = () => (
  <Placeholder 
    title="Documentation" 
    desc="Explore guides, API references, and usage examples for Scholar Shayak. We are building a comprehensive knowledge base to help you evolve your research protocol."
    icon={Info}
  />
);

export const StatusPage = () => (
  <Placeholder 
    title="System Status" 
    desc="All nodes are currently operational. We are developing real-time node monitoring and performance telemetry dashboards."
    icon={AlertCircle}
    badge="In Progress"
  />
);

export const ContactPage = () => (
  <Placeholder 
    title="Contact Nodes" 
    desc="Need assistance or have a protocol inquiry? Our support nodes are ready to connect with you. Support ticket system coming soon."
    icon={Phone}
  />
);

export default Placeholder;
