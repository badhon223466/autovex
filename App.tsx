import React, { useState, useEffect } from 'react';
import { PublicHome } from './pages/PublicHome';
import { AdminDashboard } from './pages/AdminDashboard';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem('is_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdminMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password for demo purposes - in a real app this would be more secure
    if (password === 'admin123') {
      setIsAuthorized(true);
      localStorage.setItem('is_admin_auth', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('is_admin_auth');
    setIsAdminMode(false);
  };

  if (isAdminMode && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="w-full max-w-md glass-card p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <span className="font-black text-2xl">A</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-center mb-2 uppercase tracking-tighter">Admin Access</h2>
          <p className="text-slate-500 text-center mb-8 text-sm font-medium">Authentication required to access system controls.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-50 dark:bg-white/5 border ${loginError ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all text-center text-lg font-bold tracking-widest`} 
              />
              {loginError && <p className="text-red-500 text-[10px] font-black uppercase mt-2 text-center">Invalid Access Key</p>}
            </div>
            <button type="submit" className="w-full py-5 gradient-bg text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
              Initialize Handshake
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdminMode(false)}
              className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Abort Mission
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {isAdminMode && isAuthorized ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <PublicHome onToggleTheme={toggleTheme} theme={theme} onAdminMode={() => setIsAdminMode(true)} />
      )}
    </div>
  );
};

export default App;