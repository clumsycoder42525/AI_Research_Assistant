import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Clock, MessageSquare, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import api from '../services/api';

const History = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history/chats');
      setChats(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
      + ' • ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="p-8 md:p-16 max-w-7xl mx-auto w-full min-h-screen flex flex-col bg-[#0B0F1A] premium-grid">
      <header className="mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-violet to-brand-indigo rounded-2xl flex items-center justify-center shadow-xl shadow-brand-violet/20 rotate-3">
            <HistoryIcon className="text-white" size={28} />
          </div>
          <h2 className="text-5xl font-black text-brand-gray-primary tracking-tighter leading-tight">Archive Repository</h2>
        </div>
        <p className="text-brand-gray-secondary font-bold text-xl max-w-2xl relative z-10 leading-relaxed">
          Review your past neural sessions, detailed research reports, and forensic analysis history.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-brand-violet gap-8">
            <div className="relative">
                <div className="absolute inset-0 bg-brand-violet/20 blur-3xl animate-pulse"></div>
                <Loader2 size={80} className="animate-spin text-brand-violet relative z-10" />
            </div>
            <p className="text-brand-gray-muted font-black uppercase tracking-[0.4em] text-xs">Syncing Chronological Nodes...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 glass-panel border-white/10 rounded-[44px] shadow-inner text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-brand-violet/10 blur-3xl"></div>
                <HistoryIcon size={120} className="text-slate-300 dark:text-slate-700 relative z-10" strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-black text-brand-gray-primary mb-4 tracking-tighter uppercase tracking-[0.2em]">Archive Data Null</h3>
            <p className="text-brand-gray-secondary font-bold text-lg italic max-w-md mx-auto">Protocol idle. Your past activity will securely sync here once you initialize a session.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {chats.map((chat, idx) => (
              <motion.div 
                key={chat.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col md:flex-row items-center justify-between p-10 glass-panel glass-panel-hover border-white/10 rounded-[40px] shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-brand-violet/10 transition-colors"></div>
                <div className="flex items-center gap-8 w-full md:w-auto relative z-10">
                  <div className="w-20 h-20 rounded-[28px] glass-panel border-white/10 flex items-center justify-center group-hover:bg-brand-violet group-hover:text-white transition-all duration-500 text-brand-gray-muted shadow-inner">
                    <BookOpen size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-brand-gray-primary group-hover:text-brand-violet mb-3 transition-colors tracking-tighter leading-tight">{chat.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-black text-brand-gray-muted uppercase tracking-[0.2em]">
                      <Clock size={16} className="text-brand-violet opacity-60" />
                      {formatDate(chat.created_at)}
                    </div>
                  </div>
                </div>
                <div className="mt-8 md:mt-0 flex gap-4 relative z-10">
                    <button className="flex items-center gap-3 px-8 py-4 rounded-[22px] bg-brand-gray-primary text-[#0B0F1A] text-xs font-black uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all shadow-xl group/btn">
                      Open Neural Node <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
