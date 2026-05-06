import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Zap, Shield, Globe, Users, 
  BarChart3, CheckCircle2, ArrowRight, 
  Search, BookOpen, MessageSquare, Quote, 
  Cpu, Activity, Radio, Terminal
} from 'lucide-react';

export const AIStatusIndicator = ({ label = "Node Active", status = "online" }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-white/10">
    <span className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'online' ? 'bg-brand-lime' : 'bg-brand-violet'}`}></span>
      <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'online' ? 'bg-brand-lime' : 'bg-brand-violet'}`}></span>
    </span>
    <span className="text-[10px] font-black text-brand-gray-secondary uppercase tracking-widest">{label}</span>
  </div>
);

export const FloatingNode = ({ className, delay = 0, duration = 6 }) => (
  <motion.div
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className={`absolute pointer-events-none ${className}`}
  >
    <div className="w-24 h-24 rounded-3xl bg-brand-violet/5 border border-brand-violet/10 backdrop-blur-xl flex items-center justify-center">
        <Cpu size={32} className="text-brand-violet/20" />
    </div>
  </motion.div>
);

export const Typewriter = ({ text = "", delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayText(''); // Reset on text change
    
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        setDisplayText((prev) => {
          if (i < text.length) {
            const next = prev + text.charAt(i);
            i++;
            return next;
          }
          clearInterval(intervalId);
          return prev;
        });
      }, 30);
      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, delay]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-brand-violet inline-block w-1 h-5 bg-brand-violet ml-1 align-middle"></span>
    </span>
  );
};

export const FeatureCard = ({ icon: Icon, title, desc, delay = 0, isActive = false, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    onClick={onClick}
    className={`group relative glass-panel rounded-[40px] p-10 cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-4 shadow-xl border-white/5 
      ${isActive ? 'scale-105 border-brand-violet/30 shadow-brand-violet/10 bg-brand-violet/[0.03]' : 'hover:border-brand-violet/30 hover:shadow-brand-violet/5'}
    `}
  >
    {/* Inner Gradient Glow */}
    <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(139,92,246,0.08),transparent)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      {/* Icon Wrapper */}
      <div className="relative mb-10 w-fit">
        <div className="absolute inset-0 bg-brand-violet blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-br from-brand-violet/10 to-brand-indigo/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${isActive ? 'from-brand-violet to-brand-indigo text-white shadow-lg shadow-brand-violet/20' : ''}`}>
          <Icon size={36} strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-3xl font-black text-brand-gray-primary mb-5 tracking-tight group-hover:text-brand-violet transition-colors">{title}</h3>
      <p className="text-brand-gray-secondary font-bold text-lg leading-relaxed mb-8">{desc}</p>
      
      <div className="space-y-4">
        {[
          { text: "Advanced AI Nodes", icon: CheckCircle2 },
          { text: "Real-time Protocol Sync", icon: CheckCircle2 }
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-brand-lime/10 flex items-center justify-center text-brand-lime">
              <feat.icon size={14} />
            </div>
            <span className="text-[11px] font-black text-brand-gray-muted uppercase tracking-[0.2em]">{feat.text}</span>
          </div>
        ))}
      </div>

      {/* Decorative Corner Glow */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-violet/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  </motion.div>
);

export const HowItWorksStep = ({ step, title, desc, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex gap-6 relative"
  >
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-brand-violet flex items-center justify-center text-white font-black z-10 shadow-lg shadow-brand-violet/30">
        {step}
      </div>
      <div className="flex-1 w-1 bg-gradient-to-b from-brand-violet to-transparent my-2 rounded-full min-h-[60px]"></div>
    </div>
    <div className="pb-12">
      <div className="flex items-center gap-3 mb-2">
        <Icon size={20} className="text-brand-violet" />
        <h3 className="text-xl font-black text-brand-gray-primary tracking-tight">{title}</h3>
      </div>
      <p className="text-brand-gray-secondary font-bold text-base max-w-md">{desc}</p>
    </div>
  </motion.div>
);

export const TestimonialCard = ({ name, role, feedback, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-8 rounded-[32px] relative"
  >
    <Quote className="absolute top-6 right-8 text-brand-violet/10" size={40} />
    <p className="text-brand-gray-primary font-bold text-lg leading-relaxed mb-8 italic">
      "{feedback}"
    </p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center text-white font-black text-lg shadow-lg">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="text-brand-gray-primary font-black tracking-tight">{name}</h4>
        <p className="text-xs font-black text-brand-violet uppercase tracking-widest">{role}</p>
      </div>
    </div>
  </motion.div>
);

export const StatItem = ({ value, label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col items-center text-center p-6"
  >
    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-brand-violet mb-4 shadow-sm group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-4xl font-black text-brand-gray-primary tracking-tighter mb-1">{value}</h3>
    <p className="text-xs font-black text-brand-gray-muted uppercase tracking-widest">{label}</p>
  </motion.div>
);

export const Footer = () => (
  <footer className="w-full bg-navy-950 border-t border-white/[0.06] py-20 px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-violet flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-black text-brand-gray-primary tracking-tight">Scholar <span className="text-brand-violet">Shayak</span></h2>
        </div>
        <p className="text-brand-gray-secondary font-bold text-lg max-w-sm mb-8 leading-relaxed">
          The intelligence layer for modern research. Synthesize deep insights, identify gaps, and accelerate your academic journey.
        </p>
      </div>
      <div>
        <h4 className="text-xs font-black text-brand-gray-primary uppercase tracking-[0.3em] mb-6">Protocol</h4>
        <ul className="space-y-4">
          <li><Link to="/research" className="text-brand-gray-secondary font-bold hover:text-brand-violet transition-colors">Scholar Sahayak</Link></li>
          <li><Link to="/detection" className="text-brand-gray-secondary font-bold hover:text-brand-violet transition-colors">AI Detection</Link></li>
          <li><Link to="/paraphraser" className="text-brand-gray-secondary font-bold hover:text-brand-violet transition-colors">Paraphraser</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-black text-brand-gray-primary uppercase tracking-[0.3em] mb-6">Support</h4>
        <ul className="space-y-4">
          <li><Link to="/docs" className="text-brand-gray-secondary font-bold hover:text-brand-violet transition-colors">Documentation</Link></li>
          <li><Link to="/status" className="text-brand-gray-secondary font-bold hover:text-brand-violet transition-colors">System Status</Link></li>
          <li><Link to="/contact" className="text-brand-gray-secondary font-bold hover:text-brand-violet transition-colors">Contact Nodes</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-white/[0.06] mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-[10px] font-black text-brand-gray-muted uppercase tracking-widest">© 2026 Vedanta Intelligence. All nodes operational.</p>
      <div className="flex gap-6">
        <a href="#" className="text-[10px] font-black text-brand-gray-muted uppercase tracking-widest hover:text-brand-violet">Privacy</a>
        <a href="#" className="text-[10px] font-black text-brand-gray-muted uppercase tracking-widest hover:text-brand-violet">Security</a>
      </div>
    </div>
  </footer>
);
