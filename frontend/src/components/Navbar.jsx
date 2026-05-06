import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Home, Bot, Search, FileText, 
  History, Settings, LogOut, ChevronDown, User, Zap
} from 'lucide-react';

const NavLinkItem = ({ to, icon: Icon, label, end = false }) => {
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => `
        relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group
        ${isActive 
          ? "text-brand-violet bg-white/[0.04] border border-white/[0.08]" 
          : "text-brand-gray-muted hover:text-brand-gray-primary hover:bg-white/[0.02]"}
      `}
    >
      {({ isActive }) => (
        <>
          <Icon size={16} className={`transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-brand-violet' : ''}`} />
          <span>{label}</span>
          {/* Active Indicator Underline */}
          {isActive && (
            <motion.div 
              layoutId="nav-underline"
              className="absolute -bottom-[21px] left-2 right-2 h-[3px] bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan rounded-t-full shadow-[0_-4px_20px_rgba(139,92,246,1)]"
            />
          )}
        </>
      )}
    </NavLink>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const username = localStorage.getItem('username') || 'Scholar';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0F172A]/60 backdrop-blur-3xl border-b border-white/[0.08] z-[100] px-8 flex items-center justify-between transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
      {/* Logo Section */}
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center shadow-lg shadow-brand-violet/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
          <Sparkles className="text-white" size={20} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-brand-gray-primary leading-none">
              Scholar <span className="text-brand-violet italic">Shayak</span>
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-violet/10 border border-brand-violet/20">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse-glow" />
              <span className="text-[7px] font-black uppercase tracking-widest text-brand-violet">Neural Core Active</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-brand-gray-muted uppercase tracking-[0.3em] mt-1">Intelligence Protocol v4.0</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center gap-1 glass-panel p-1.5 rounded-2xl">
        <NavLinkItem to="/" icon={Home} label="Dashboard" end />
        <NavLinkItem to="/research" icon={Sparkles} label="Research" />
        <NavLinkItem to="/paraphraser" icon={FileText} label="Paraphraser" />
        <NavLinkItem to="/detection" icon={Search} label="Detection" />
        <NavLinkItem to="/history" icon={History} label="History" />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {!localStorage.getItem('token') ? (
          <button 
            onClick={() => navigate('/auth')}
            className="px-6 py-2.5 rounded-xl bg-brand-violet text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-violet/90 transition-all shadow-lg shadow-brand-violet/20"
          >
            Login
          </button>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-all shadow-sm group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-violet text-white flex items-center justify-center shadow-md shadow-brand-violet/20 group-hover:rotate-6 transition-transform">
                <User size={18} />
              </div>
              <div className="hidden sm:block text-left px-1">
                <p className="text-xs font-black text-brand-gray-primary uppercase tracking-widest">{username}</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 mr-2 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-[#0F172A]/90 border border-white/[0.08] rounded-[24px] shadow-2xl p-2 overflow-hidden z-[110] backdrop-blur-3xl"
                >
                  <div className="p-3 mb-2 border-b border-white/[0.06]">
                    <p className="text-xs font-bold text-brand-gray-muted uppercase tracking-widest pl-1">Primary Account</p>
                  </div>
                  <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] text-sm font-bold text-brand-gray-secondary transition-all">
                    <Settings size={18} /> Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-sm font-bold text-red-500 transition-all mt-1"
                  >
                    <LogOut size={18} /> Disconnect
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
