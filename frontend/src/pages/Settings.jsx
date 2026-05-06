import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, User, Key, Globe, LayoutTemplate, ShieldCheck } from 'lucide-react';

const SettingsCard = ({ icon: Icon, title, description, badge, children }) => (
  <div className="glass-panel glass-panel-hover p-8 rounded-[32px] flex flex-col items-start text-left border-white/10 shadow-xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-brand-violet/10 transition-colors"></div>
    <div className="flex items-center gap-4 mb-6 w-full relative z-10">
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] text-brand-violet border border-white/[0.08] flex items-center justify-center shadow-inner">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-black text-brand-gray-primary tracking-tight">{title}</h3>
          {badge && <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-violet text-white shadow-lg shadow-brand-violet/20">{badge}</span>}
        </div>
      </div>
    </div>
    <p className="text-base text-brand-gray-secondary font-bold mb-8 leading-relaxed relative z-10">
      {description}
    </p>
    <div className="w-full mt-auto relative z-10">
      {children}
    </div>
  </div>
);

const Settings = () => {
  return (
    <div className="p-8 md:p-16 max-w-7xl mx-auto w-full min-h-screen bg-[#0B0F1A] premium-grid">
      <header className="mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-violet to-brand-indigo rounded-2xl flex items-center justify-center shadow-lg shadow-brand-violet/20 rotate-3 group-hover:rotate-0 transition-transform">
            <SettingsIcon className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-black text-brand-gray-primary tracking-tight">System Node</h2>
        </div>
        <p className="text-brand-gray-secondary font-bold text-lg max-w-2xl relative z-10 leading-relaxed">
          Manage your AI preferences, API endpoints, and system architecture parameters.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingsCard 
          icon={Key} 
          title="LLM Signature"
          description="Your backend requires a Groq API key set in the local .env file. We do not store this key externally."
          badge="Active"
        >
          <div className="relative group">
            <input 
              type="password" 
              value="gsk_***************************************"
              readOnly
              className="w-full bg-white/[0.03] border border-white/[0.08] text-brand-gray-muted px-6 py-4 rounded-2xl focus:outline-none cursor-not-allowed font-mono text-sm"
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
              <span className="text-[10px] font-black text-brand-gray-muted bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-lg">ENV-LOCK</span>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard 
          icon={Globe} 
          title="Backbone URL"
          description="Identify the active URL where the FastAPI backend handles database queries and LLM processing."
        >
          <div className="w-full bg-brand-violet/10 border border-brand-violet/30 text-brand-violet px-6 py-4 rounded-2xl font-mono text-sm inline-flex items-center gap-3 shadow-lg shadow-brand-violet/5">
             <div className="w-2 h-2 rounded-full bg-brand-violet animate-pulse"></div>
             http://localhost:8000/api
          </div>
        </SettingsCard>

        <SettingsCard 
          icon={ShieldCheck} 
          title="Security Plan"
          description="You are currently running the local deployment of Scholar Shayak utilizing premium agentic nodes."
        >
          <div className="flex items-center gap-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
             <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-navy-950 shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={20} />
             </div>
             <div>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest leading-none">Premium Tier</p>
                <p className="text-[10px] text-emerald-400/60 font-bold italic mt-1">End-to-End Encryption Active</p>
             </div>
          </div>
        </SettingsCard>

        <SettingsCard 
          icon={LayoutTemplate} 
          title="Interface Mode"
          description="The Intelligence Dark architecture is now forced across all cerebral nodes for optimal forensic analysis."
        >
          <div className="flex gap-4">
             <button 
                className="flex-1 px-4 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest bg-white/[0.04] border border-white/[0.08] text-brand-gray-muted opacity-50 cursor-not-allowed"
             >
                Light Elite
             </button>
             <button 
                className="flex-1 px-4 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest bg-gradient-to-r from-brand-violet to-brand-indigo text-white shadow-xl shadow-brand-violet/20 border border-white/10"
             >
                Intelligence Dark
             </button>
          </div>
        </SettingsCard>

      </div>
    </div>
  );
};

export default Settings;
