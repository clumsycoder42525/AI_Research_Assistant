import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import History from './pages/History';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import ScholarSahayak from './pages/ScholarSahayak';
import AIDetection from './pages/AIDetection';
import Paraphrasing from './pages/Paraphrasing';
import { DocsPage, StatusPage, ContactPage } from './pages/Placeholder';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import BackgroundElements from './components/BackgroundElements';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative flex flex-col w-full min-h-screen bg-[#0B0F1A] text-brand-gray-primary selection:bg-brand-violet/20 selection:text-brand-violet transition-colors duration-500 overflow-x-hidden">
          <BackgroundElements />
          
          <Navbar />
          <main className="flex-1 relative z-10 w-full pt-20">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/research" element={<ScholarSahayak />} />
                  <Route path="/detection" element={<AIDetection />} />
                  <Route path="/paraphraser" element={<Paraphrasing />} />
                  <Route path="/chat" element={<Chatbot />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/docs" element={<DocsPage />} />
                  <Route path="/status" element={<StatusPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  
                  {/* Aliases for compatibility */}
                  <Route path="/scholar" element={<Navigate to="/research" replace />} />
                  <Route path="/detect" element={<Navigate to="/detection" replace />} />
                  <Route path="/paraphrase" element={<Navigate to="/paraphraser" replace />} />
                  <Route path="/auth" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
