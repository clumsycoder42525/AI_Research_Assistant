import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Home, FileText, Search, History, Settings, Sparkles, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NavItem = ({ to, icon: Icon, label, end = false }) => {
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => cn(
        "relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group overflow-hidden",
        isActive 
          ? "text-brand-neon bg-gradient-to-r from-brand-blue/20 to-brand-cyan/10 shadow-[inset_0_0_12px_rgba(6,182,212,0.2)]" 
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
      )}
    >
      {({ isActive }) => (
        <>
          <Icon size={20} className={cn("relative z-10 transition-transform duration-300", isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]" : "group-hover:scale-110")} />
          <span className="relative z-10">{label}</span>
          
          {isActive && (
            <motion.div 
              layoutId="nav-pill"
              className="absolute inset-0 border border-brand-cyan/30 rounded-xl bg-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-neon rounded-r-full shadow-[0_0_10px_rgba(0,242,254,1)]"></div>
          )}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Researcher';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/auth');
  };

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-72 h-full flex flex-col border-r border-slate-800/60 bg-navy-900/60 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-20"
    >
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <Sparkles size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-md">
          Vedanta AI
        </h1>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        <NavItem to="/" icon={Home} label="Dashboard" end />
        <NavItem to="/scholar" icon={Sparkles} label="Scholar Copilot" />
        <NavItem to="/chat" icon={Bot} label="Research Assistant" />
        <NavItem to="/library" icon={Search} label="Library & Workspace" />
        <NavItem to="/notes" icon={FileText} label="Smart Notes" />
        
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-4"></div>
        
        <NavItem to="/paraphrase" icon={FileText} label="Paraphraser" />
        <NavItem to="/detect" icon={Search} label="AI Detection" />
        <NavItem to="/history" icon={History} label="History" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>

      <div className="p-4 mt-auto space-y-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-navy-900 border border-slate-700/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/50">
                <span className="text-brand-cyan font-bold uppercase">{username[0]}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-200 truncate">{username}</p>
                <p className="text-xs text-brand-neon font-mono">Premium Access</p>
              </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm font-medium border border-red-500/20"
          >
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
