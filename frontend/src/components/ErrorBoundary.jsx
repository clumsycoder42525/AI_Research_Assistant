import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Something went wrong</h1>
          <p className="text-slate-500 text-lg max-w-md mb-8">
            The application encountered an unexpected error. This usually happens when data from the research node is incomplete.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-brand-violet text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-violet/20"
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-2xl text-left max-w-4xl overflow-auto">
              <p className="text-xs font-mono text-red-800 whitespace-pre-wrap">{this.state.error?.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
