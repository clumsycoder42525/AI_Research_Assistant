import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../services/api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // FastAPI OAuth2 format requires form-data
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);
        
        const res = await api.post('/auth/login', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('username', res.data.username);
        navigate('/');
      } else {
        await api.post('/auth/signup', formData);
        setIsLogin(true); // Automatically switch to login upon successful signup
        setError('Signup successful! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden bg-[#0B0F1A]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-violet/20 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-indigo/20 blur-[150px] animate-blob" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 glass-panel rounded-[40px] shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-brand-gray-primary">
            Scholar <span className="text-brand-violet">Shayak</span>
          </h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-brand-cyan uppercase mt-2">Intelligence Layer</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`text-sm p-3 rounded-xl border ${error.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
              {error}
            </motion.div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-brand-gray-muted ml-1">Username</label>
            <div className="relative">
              <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-muted" />
              <input 
                type="text" 
                required 
                placeholder="Enter workspace handle"
                className="w-full bg-white/[0.03] border border-white/[0.06] text-brand-gray-primary rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-[10px] focus:ring-brand-violet/5 focus:border-brand-violet/30 transition-all placeholder:text-brand-gray-muted"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1">
              <label className="text-xs font-semibold uppercase text-brand-gray-muted ml-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-muted" />
                <input 
                  type="email" 
                  required={!isLogin} 
                  placeholder="researcher@university.edu"
                  className="w-full bg-white/[0.03] border border-white/[0.06] text-brand-gray-primary rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-[10px] focus:ring-brand-violet/5 focus:border-brand-violet/30 transition-all placeholder:text-brand-gray-muted"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-brand-gray-muted ml-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-muted" />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/[0.06] text-brand-gray-primary rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-[10px] focus:ring-brand-violet/5 focus:border-brand-violet/30 transition-all placeholder:text-brand-gray-muted"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="premium-button w-full mt-6 py-4 rounded-xl shadow-2xl shadow-brand-violet/20 group/auth"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : null}
            {isLoading ? 'Authenticating...' : (isLogin ? 'Access Workspace' : 'Initialize Account')}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-brand-gray-muted">
          {isLogin ? "Don't have access? " : "Already initialized? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-brand-cyan hover:text-brand-violet cursor-pointer font-black transition-colors uppercase tracking-widest text-[10px]">
            {isLogin ? "Request an account" : "Login here"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
