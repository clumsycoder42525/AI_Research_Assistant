import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Send, Bot, User, Sparkles, Download, FileText, Copy, ThumbsUp, ThumbsDown, BookOpen, ExternalLink, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { ensureString } from '../utils/renderUtils';

const ReferenceCard = ({ ref_data, index }) => (
  <a 
    href={ref_data.url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-start gap-3 bg-navy-900/60 hover:bg-navy-800 border border-slate-700/50 hover:border-brand-cyan/40 p-4 rounded-xl transition-all group cursor-pointer"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-cyan text-xs font-bold">
      [{index + 1}]
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <Globe size={12} className="text-brand-cyan flex-shrink-0" />
        <h6 className="text-sm font-bold text-slate-200 truncate group-hover:text-brand-neon transition-colors">{ref_data.title}</h6>
        <ExternalLink size={12} className="text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {ref_data.snippet && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ref_data.snippet}</p>
      )}
      <p className="text-[10px] text-brand-cyan/60 mt-1 truncate font-mono">{ref_data.url}</p>
    </div>
  </a>
);

const Chatbot = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isReportMode, setIsReportMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewSession = () => {
    setChatId(null);
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await api.post('/chat/', {
        prompt: userMsg,
        chat_id: chatId,
        generate_report: isReportMode
      });

      if (!chatId) setChatId(response.data.id);

      const serverMessages = response.data.messages;
      const lastMsg = serverMessages[serverMessages.length - 1]; 
      const refs = response.data.references || [];
      
      if (response.data.report && isReportMode) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          is_report: true, 
          report: response.data.report,
          references: refs
        }]);
      } else {
        setMessages(prev => [...prev, {
          ...lastMsg,
          references: refs
        }]);
      }

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error answering your request. Please start a new session.' }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleExport = async (format) => {
    if (!chatId) return;
    try {
      const response = await api.get(`/chat/${chatId}/export?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Research_Report_${chatId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Failed to export", e);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <header className="flex-none p-6 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet shadow-sm">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">Scholar Shayak</h2>
            <p className="text-[10px] text-brand-violet font-bold uppercase tracking-widest">{chatId ? `Session ID: ${chatId}` : 'Research Node Active'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            {/* New Chat Button */}
            <button 
              onClick={handleNewSession}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
            >
              + New
            </button>

            {/* Export Menu */}
            {isReportMode && chatId && (
                <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300 flex items-center gap-2 text-sm transition-colors shadow-sm"
                >
                  <Download size={16} /> Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-navy-800 border border-slate-600 rounded-xl shadow-2xl py-2 overflow-hidden z-50">
                    <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm text-slate-200 flex items-center gap-2"><FileText size={14}/> PDF</button>
                    <button onClick={() => handleExport('docx')} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm text-slate-200 flex items-center gap-2"><FileText size={14} className="text-blue-400"/> DOCX</button>
                  </div>
                )}
              </div>
            )}
            
            {/* Toggle Report Mode */}
            <button 
              onClick={() => setIsReportMode(!isReportMode)}
              className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 border ${
                isReportMode 
                ? 'border-brand-purple bg-brand-purple/10 text-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isReportMode ? <Sparkles size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-500"></div>}
              Research Mode
            </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth z-0 relative">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none"
            >
              <div className="w-20 h-20 mb-6 rounded-3xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50 shadow-2xl">
                <Bot size={40} className="text-slate-400 drop-shadow-md" />
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-2">Initialize Research Protocol</h3>
              <p className="text-sm max-w-md text-center text-slate-400">Query the LLM orchestrator by typing below. Wikipedia sources are automatically fetched as context. Activate "Research Mode" for structured reports.</p>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className={`flex gap-4 max-w-5xl mx-auto w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="shrink-0 flex items-start mt-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border ${
                  msg.role === 'user' 
                  ? 'bg-gradient-to-br from-brand-cyan/80 to-brand-blue border-brand-cyan text-white shadow-brand-blue/30' 
                  : 'bg-navy-900 border-slate-600 text-brand-purple shadow-slate-900/50'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
              </div>

              <div className="flex-1 max-w-[85%] group">
                <div className={`relative px-6 py-5 shadow-2xl ${
                  msg.is_report 
                  ? 'bg-gradient-to-br from-navy-800/90 to-navy-900/90 border border-brand-purple/40 backdrop-blur-xl rounded-2xl rounded-tl-sm ring-1 ring-brand-purple/10 w-full'
                  : msg.role === 'user' 
                    ? 'bg-gradient-to-br from-brand-blue to-blue-700 text-white rounded-2xl rounded-tr-sm shadow-brand-blue/20 float-right inline-block' 
                    : 'bg-navy-800/80 border border-slate-700/80 text-slate-200 backdrop-blur-md rounded-2xl rounded-tl-sm w-full inline-block'
                }`}>
                  {msg.is_report && msg.report ? (
                    <div className="space-y-8 w-full">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-2">
                        <div className="p-2 bg-brand-purple/20 rounded-lg"><Sparkles size={24} className="text-brand-purple animate-pulse" /></div>
                        <div>
                            <h4 className="text-xl font-bold text-white tracking-wide">Structured Research Report</h4>
                            <p className="text-xs text-brand-purple font-mono uppercase tracking-widest mt-1">Depth: {msg.report.depth_level}</p>
                        </div>
                      </div>
                      
                      <div className="prose prose-invert max-w-none text-slate-300">
                        <h5 className="text-sm uppercase tracking-widest text-brand-cyan mb-3 font-bold border-b border-brand-cyan/20 inline-block pb-1">Abstract Summary</h5>
                        <p className="leading-relaxed">{msg.report.summary}</p>
                      </div>

                      <div className="prose prose-invert max-w-none text-slate-300">
                        <h5 className="text-sm uppercase tracking-widest text-brand-cyan mb-3 font-bold border-b border-brand-cyan/20 inline-block pb-1">Key Insights</h5>
                        <div className="bg-black/20 p-5 rounded-xl border border-white/5 font-sans leading-relaxed">
                          <ReactMarkdown>{ensureString(msg.report.key_points)}</ReactMarkdown>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
                            <h5 className="text-sm uppercase tracking-widest text-brand-neon mb-3 font-bold">Applications</h5>
                            <p className="text-slate-400 text-sm leading-relaxed">{msg.report.applications}</p>
                        </div>
                        <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
                            <h5 className="text-sm uppercase tracking-widest text-brand-neon mb-3 font-bold">Conclusion</h5>
                            <p className="text-slate-400 text-sm leading-relaxed">{msg.report.conclusion}</p>
                        </div>
                      </div>

                      {msg.report.citations && msg.report.citations.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-slate-700/50">
                              <h5 className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400 mb-4 font-bold">
                                  <BookOpen size={16}/> Wikipedia Sources & References
                              </h5>
                              <ul className="space-y-3">
                                  {msg.report.citations.map((cit, i) => (
                                      <li key={i} className="text-sm text-slate-400 flex items-start gap-3 bg-navy-900/50 p-3 rounded-lg border border-slate-800 hover:border-brand-cyan/30 transition-colors">
                                          <span className="text-brand-purple font-bold flex-shrink-0">[{i+1}]</span>
                                          {cit.includes('http') ? (
                                            <a href={cit.split(' - ').pop()} target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:text-brand-neon transition-colors break-all">
                                              {cit}
                                            </a>
                                          ) : cit}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                      
                    </div>
                  ) : (
                    <div className={msg.role === 'user' ? 'text-white' : 'prose prose-invert max-w-none text-slate-200'}>
                        {msg.role === 'assistant' ? <ReactMarkdown>{ensureString(msg.content)}</ReactMarkdown> : ensureString(msg.content)}
                    </div>
                  )}
                </div>
                
                {/* Wikipedia References Cards for Normal Chat */}
                {msg.role === 'assistant' && msg.references && msg.references.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 space-y-2"
                  >
                    <h6 className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-bold ml-1 mb-2">
                      <Globe size={12} /> Wikipedia Sources
                    </h6>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.references.map((ref, i) => (
                        <ReferenceCard key={i} ref_data={ref} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-3 mt-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigator.clipboard.writeText(msg.is_report ? msg.report?.summary : msg.content)} className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors bg-slate-800/50 rounded-md border border-slate-700/50">
                          <Copy size={14} />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-emerald-400 transition-colors bg-slate-800/50 rounded-md border border-slate-700/50">
                          <ThumbsUp size={14} />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors bg-slate-800/50 rounded-md border border-slate-700/50">
                          <ThumbsDown size={14} />
                      </button>
                  </div>
                )}
              </div>
              <div className="clear-both"></div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-5xl mx-auto w-full"
            >
              <div className="shrink-0 flex items-end">
                <div className="w-10 h-10 rounded-full bg-navy-900 border border-slate-600 flex items-center justify-center text-brand-purple shadow-lg">
                  <Bot size={18} />
                </div>
              </div>
              <div className="px-6 py-5 rounded-2xl bg-navy-800/80 border border-slate-700/80 backdrop-blur-md rounded-bl-sm shadow-xl flex items-center gap-3 h-[60px]">
                <span className="text-sm font-medium text-brand-purple">Searching Wikipedia & Synthesizing</span>
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></motion.div>
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></motion.div>
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-10" />
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 md:p-6 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/95 dark:via-slate-950/95 to-transparent z-10 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue to-brand-purple rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
          <div className="relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:border-brand-blue rounded-3xl overflow-hidden shadow-2xl transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isReportMode ? "Query the engine for a comprehensive research brief (e.g. 'Synthesize the impact of quantum computing on modern cryptography')..." : "Ask a quick question — Wikipedia will be searched for context..."}
              disabled={isLoading}
              className="flex-1 max-h-[200px] bg-transparent text-slate-900 dark:text-slate-100 px-6 py-5 focus:outline-none resize-none disabled:opacity-50 placeholder:text-slate-500 text-[15px] font-medium"
            />
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Globe size={12} /> Wikipedia Search Enabled
            </div>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading} 
              className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-brand-violet text-white font-bold hover:bg-slate-800 dark:hover:bg-brand-violet/80 disabled:bg-slate-400 dark:disabled:bg-slate-800 disabled:text-slate-100 transition-all focus:outline-none flex items-center gap-2"
            >
              <Send size={16} /> Send
            </button>
        </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1 font-medium tracking-wide">
            Vedanta AI uses Wikipedia as a knowledge source. Please verify factual data critically.
          </p>
        </form>
      </div>

    </div>
  );
};

export default Chatbot;
