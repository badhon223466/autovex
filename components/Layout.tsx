import React, { useState, useEffect } from 'react';
import { SiteConfig } from '../types';
import { Icon } from './Icon';

interface NavbarProps {
  config: SiteConfig;
  isAdmin?: boolean;
  onLogout?: () => void;
  onToggleTheme?: () => void;
  theme?: 'light' | 'dark';
}

export const Navbar: React.FC<NavbarProps> = ({ config, isAdmin, onToggleTheme, theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 70;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // For iOS specific scroll locking
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-3 md:py-4 shadow-sm dark:shadow-xl' : 'bg-transparent py-5 md:py-8'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center group">
          {config.logoUrl ? (
            <img src={config.logoUrl} alt="Autovex Logo" className="h-10 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
          ) : (
            <div className="w-10 h-10 md:w-14 md:h-14 border-2 border-primary flex items-center justify-center text-primary rotate-45 group-hover:bg-primary group-hover:text-white transition-all">
              <Icon name="Cpu" size={24} className="-rotate-45" />
            </div>
          )}
        </a>
        
        {!isAdmin && (
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {['about', 'services', 'portfolio', 'contact'].map(link => (
              <a 
                key={link}
                href={`#${link}`} 
                onClick={(e) => scrollToSection(e, link)} 
                className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
            
            <button onClick={onToggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-primary hover:scale-110 transition-transform">
              <Icon name={theme === 'dark' ? "Sun" : "Moon"} size={18} />
            </button>

            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, 'contact')}
              className="px-5 py-2 md:px-6 md:py-2.5 gradient-bg text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest glow-button rounded-lg shadow-lg shadow-primary/20"
            >
              Hire Me
            </a>
          </div>
        )}

        <div className="flex items-center gap-4 md:hidden">
          <button onClick={onToggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-primary">
            <Icon name={theme === 'dark' ? "Sun" : "Moon"} size={20} />
          </button>
          <button className="text-primary p-2 active:bg-slate-100 dark:active:bg-white/5 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-white dark:bg-slate-950 z-[110] transition-all duration-500 overflow-y-auto ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
        <div className="min-h-full flex flex-col items-center justify-start py-32 px-6 gap-8">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-4 text-primary p-2" aria-label="Close menu">
            <Icon name="X" size={30} />
          </button>
          {['home', 'about', 'services', 'portfolio', 'contact'].map(link => (
            <a 
              key={link} 
              href={`#${link}`} 
              onClick={(e) => scrollToSection(e, link)} 
              className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter active:text-primary transition-all hover:scale-110"
            >
              {link}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={(e) => scrollToSection(e, 'contact')}
            className="mt-6 w-full max-w-xs px-12 py-5 gradient-bg text-white text-sm font-black text-center uppercase tracking-widest rounded-2xl glow-button shadow-2xl shadow-primary/30"
          >
            Hire Me Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC<{ config: SiteConfig, onAdminMode?: () => void }> = ({ config, onAdminMode }) => (
  <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 pt-12 md:pt-32 pb-6 md:pb-16 relative overflow-hidden w-full">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-20 mb-12 md:mb-20">
        <div className="sm:col-span-2">
          <div className="flex items-center mb-6">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Autovex Logo" className="h-12 md:h-16 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-primary flex items-center justify-center text-primary rotate-45">
                <Icon name="Activity" size={20} className="-rotate-45" />
              </div>
            )}
          </div>
          <p className="text-slate-500 max-w-sm mb-6 text-xs md:text-sm leading-relaxed">
            Industrial automation engineer specializing in mission-critical PLC, HMI, and SCADA systems globally.
          </p>
          <div className="flex gap-3">
             <a href={config.socials.linkedin} className="w-9 h-9 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary rounded-lg transition-all"><Icon name="Linkedin" size={16} /></a>
             <a href={config.socials.github} className="w-9 h-9 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary rounded-lg transition-all"><Icon name="Github" size={16} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5">Navigation</h4>
          <ul className="space-y-3 text-slate-500 text-[9px] md:text-xs font-bold uppercase tracking-widest">
            <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
            <li><a href="#portfolio" className="hover:text-primary transition-colors">Portfolio</a></li>
            <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="overflow-hidden">
          <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5">Connect</h4>
          <ul className="space-y-3 text-slate-500 text-[9px] md:text-xs font-bold uppercase tracking-widest">
            <li className="flex gap-3 items-center">
              <Icon name="Phone" size={12} className="text-primary shrink-0" />
              <span className="truncate">{config.phone}</span>
            </li>
            <li className="flex gap-3 items-center">
              <Icon name="Mail" size={12} className="text-primary shrink-0" />
              <span className="truncate">{config.email}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="pt-6 md:pt-12 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 dark:text-slate-700">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.4em] text-center md:text-left">&copy; {new Date().getFullYear()} Md Badhon . Industrial Excellence</p>
          {onAdminMode && (
            <button onClick={onAdminMode} className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-800 hover:text-primary transition-colors">System Access</button>
          )}
        </div>
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-10 h-10 md:w-12 md:h-12 gradient-bg text-white flex items-center justify-center rounded-xl glow-cyan shadow-lg shadow-primary/20 active:scale-90">
          <Icon name="ArrowUp" size={20} />
        </button>
      </div>
    </div>
  </footer>
);