import React, { useEffect, useState, useRef } from 'react';
import { AppState, Project } from '../types';
import { storageService } from '../services/storageService';
import { Navbar, Footer } from '../components/Layout';
import { Icon } from '../components/Icon';

const HIGHLIGHTS = [
  'Siemens S7-1200/1500',
  'Mitsubishi FX/Q Series',
  'Delta DVP/AS Series',
  'Allen-Bradley Studio 5000',
  'LS ELECTRIC PLC/VFD',
  'Schneider Modicon',
  'Omron Sysmac Studio',
  'Yaskawa VFD Tuning',
  'HMI/SCADA Design'
];

interface PublicHomeProps {
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  onAdminMode: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onToggleTheme, theme, onAdminMode }) => {
  const [data, setData] = useState<AppState | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!data) {
      setData(storageService.getData());
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setHighlightIndex((prev) => (prev + 1) % HIGHLIGHTS.length);
        setFade(true);
      }, 300);
    }, 3000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [data]);

  // Handle modal escape key and scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedProject]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate relative mouse position (-1 to 1)
    const x = (clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (clientY - innerHeight / 2) / (innerHeight / 2);
    
    setMousePos({ x, y });
  };

  const scrollToSection = (e: any, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (!data) return null;

  const { config, services, projects, skills, timeline, testimonials } = data;

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    const formData = new FormData(e.currentTarget);
    storageService.addMessage({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      message: formData.get('message') as string
    });
    setTimeout(() => {
      setFormStatus('success');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1200);
  };

  const brands = ['SIEMENS', 'MITSUBISHI', 'DELTA', 'LS ELECTRIC', 'ROCKWELL', 'SCHNEIDER', 'OMRON', 'YASKAWA', 'FANUC', 'ABB'];

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500 overflow-x-hidden w-full">
      <Navbar config={config} onToggleTheme={onToggleTheme} theme={theme} />
      
      {/* Hero Section */}
      <section 
        id="home" 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 bg-white dark:bg-slate-950 transition-colors border-b border-slate-200 dark:border-white/5 overflow-hidden"
      >
        {/* Parallax Background Grid */}
        <div 
          className="absolute inset-0 bg-grid opacity-30 pointer-events-none transition-transform duration-700 ease-out"
          style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
        ></div>
        
        {/* Floating Icons with Enhanced Parallax */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-[20%] left-[10%] opacity-20 dark:opacity-10 transition-transform duration-1000 ease-out"
            style={{ transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)` }}
          >
            <Icon name="Cpu" size={64} className="text-primary rotate-12 animate-float" />
          </div>
          <div 
            className="absolute top-[25%] right-[15%] opacity-15 dark:opacity-5 transition-transform duration-1000 ease-out"
            style={{ transform: `translate(${mousePos.x * -50}px, ${mousePos.y * -50}px)` }}
          >
            <Icon name="Zap" size={48} className="text-primary -rotate-12 animate-float" style={{ animationDelay: '1s' }} />
          </div>
          <div 
            className="absolute bottom-[25%] left-[15%] opacity-15 dark:opacity-5 transition-transform duration-1000 ease-out"
            style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * 60}px)` }}
          >
            <Icon name="Settings" size={56} className="text-primary rotate-45 animate-float" style={{ animationDelay: '2s' }} />
          </div>
          <div 
            className="absolute bottom-[20%] right-[10%] opacity-20 dark:opacity-10 transition-transform duration-1000 ease-out"
            style={{ transform: `translate(${mousePos.x * 60}px, ${mousePos.y * -30}px)` }}
          >
            <Icon name="Code" size={40} className="text-primary -rotate-6 animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>

        {/* Dynamic Glow Layer */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] pointer-events-none transition-transform duration-1000 ease-out"
          style={{ transform: `translate(calc(-50% + ${mousePos.x * 60}px), calc(-50% + ${mousePos.y * 60}px))` }}
        ></div>
        
        <div className="reveal relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto py-12 pt-32 md:pt-40">
          {/* Available for Project Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary/20 bg-primary/5 rounded-full text-primary text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Available for Projects
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tighter uppercase text-slate-900 dark:text-white transition-colors">
            Industrial <br className="hidden sm:block" />
            <span className="gradient-text">Automation</span> <br className="hidden sm:block" />
            Engineer
          </h1>
          
          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
            Expertise in <span className={`gradient-text font-black border-b-2 border-primary/20 transition-all duration-300 inline-block min-w-[200px] ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {HIGHLIGHTS[highlightIndex]}
            </span>. <br className="hidden sm:block" /> Scaling manufacturing with precision and intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full px-6 max-w-md sm:max-w-none mb-12">
            <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')} className="w-full sm:w-auto px-10 py-4 gradient-bg text-white font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 rounded-xl shadow-2xl shadow-primary/25 transition-all hover:scale-105 active:scale-95">
              <Icon name="Eye" size={18} /> View Projects
            </a>
          </div>

          <div className="w-full overflow-hidden relative opacity-40">
            <div className="flex whitespace-nowrap animate-marquee">
              {[...brands, ...brands].map((brand, idx) => (
                <span key={idx} className="text-xs md:text-sm font-black tracking-[0.4em] px-12 text-slate-400 dark:text-slate-600 uppercase">{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-white/5 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <StatBox value="150+" label="Successful Projects" />
            <StatBox value={`${config.experienceYears}`} label="Years Experience" />
            <StatBox value="50+" label="Global Clients" />
            <StatBox value="99.9%" label="System Uptime" />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-12 md:py-20 bg-white dark:bg-slate-950 transition-colors scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="reveal text-center mb-10 md:mb-16">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-3 inline-block">Competencies</span>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white">Technical <span className="gradient-text">Proficiency</span></h2>
          </div>
          
          <div className="max-w-6xl mx-auto glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {skills.map(skill => (
                <div key={skill.id} className="reveal group">
                  <div className="flex justify-between items-end mb-3">
                    <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 group-hover:text-primary transition-colors">{skill.name}</h4>
                    <span className="font-mono text-primary text-[10px] md:text-xs font-bold">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/5 overflow-hidden rounded-full">
                    <div className="h-full gradient-bg transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20 bg-slate-50 dark:bg-slate-900/30 transition-colors scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center max-w-7xl mx-auto">
            <div className="reveal flex-1 w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-[14px] overflow-hidden border-2 border-primary/20 p-1 shadow-2xl bg-white dark:bg-slate-900">
                <img 
                  src={config.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-[10px] grayscale hover:grayscale-0 transition-all duration-700" 
                />
                
                {/* Full Identity Name on Top Left - No Label, No Background, Primary Color */}
                <div className="absolute top-6 left-6 z-10">
                    <div className="text-sm md:text-base font-black text-primary uppercase tracking-tight drop-shadow-sm">{config.fullName}</div>
                </div>

                <div className="absolute bottom-6 right-6 glass-card p-4 md:p-6 rounded-[10px] border-primary/20 shadow-2xl z-10">
                    <div className="text-2xl md:text-4xl font-black text-primary leading-none">{config.experienceYears}</div>
                    <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Years Expert</div>
                </div>
              </div>
            </div>
            
            <div className="reveal flex-1 text-center lg:text-left">
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 inline-block">Introduction</span>
              <h2 className="text-3xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white leading-tight">Expert Industrial <br/><span className="gradient-text">Automation Engineer.</span></h2>
              <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-2xl">
                "{config.aboutBio}"
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                 <div className="px-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
                    <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">150+</div>
                    <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">Deployments</div>
                 </div>
                 <div className="px-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
                    <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Global</div>
                    <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">Standards</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-20 bg-white dark:bg-slate-950 transition-colors scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="reveal text-center mb-10 md:mb-16">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-3 inline-block">What I Offer</span>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white">Core <span className="gradient-text">Services</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
            {services.map(s => (
              <div key={s.id} className="reveal group p-8 md:p-10 glass-card rounded-3xl hover:border-primary/40 shadow-xl transition-all hover:-translate-y-2">
                <div className="w-14 h-14 md:w-16 md:h-16 border border-slate-200 dark:border-white/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all rounded-2xl rotate-12 group-hover:rotate-0">
                  <Icon name={s.icon} size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-3 uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{s.description}</p>
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest group-hover:gap-4 transition-all">
                  Initialize Request <Icon name="ArrowRight" size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-12 md:py-20 bg-slate-50 dark:bg-slate-900/30 transition-colors scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="reveal text-center mb-10 md:mb-16">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-3 inline-block">Work Showcase</span>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white">Recent <span className="gradient-text">Projects</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {projects.map((project: Project) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="reveal group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30 cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg border border-primary/20 transition-all group-hover:bg-primary group-hover:text-white">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-30">
                    <p className="text-slate-300 text-sm mb-8 line-clamp-3 leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                      {project.description}
                    </p>
                    <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                      <div className="flex-1 py-4 bg-primary text-white text-center font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white hover:text-primary transition-all shadow-xl shadow-primary/20">
                        Launch Case Study
                      </div>
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 h-12 bg-white/10 backdrop-blur-md flex items-center justify-center text-white rounded-xl hover:bg-white hover:text-slate-950 transition-colors border border-white/20"
                      >
                        <Icon name="Github" size={20} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-8 transition-opacity duration-300 group-hover:opacity-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-900 dark:text-white text-xl font-black uppercase tracking-tighter leading-none">
                      {project.name}
                    </h3>
                    <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="ArrowUpRight" size={20} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-6 h-px bg-primary/30"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {project.duration || 'Complete Build'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Popup (Modal) */}
      {selectedProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-lg animate-fadeIn" onClick={() => setSelectedProject(null)}></div>
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 animate-fadeIn scrollbar-hide">
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-6 right-6 w-12 h-12 bg-white/50 dark:bg-white/5 backdrop-blur-md flex items-center justify-center rounded-2xl text-slate-500 hover:text-primary transition-colors z-20 shadow-lg"
              title="Close (Esc)"
            >
              <Icon name="X" size={24} />
            </button>
            
            <div className="flex flex-col lg:flex-row min-h-full">
              <div className="lg:w-2/5 flex flex-col border-r border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/20">
                <div className="aspect-video lg:aspect-square overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                   <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
                   <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-full object-cover relative z-10" />
                   <div className="absolute bottom-6 left-6 z-10">
                      <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-xl">Status: Deployed</span>
                   </div>
                </div>
                <div className="p-8 md:p-12 space-y-8">
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-3">Project Identifier</h4>
                    <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase leading-tight tracking-tighter">{selectedProject.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Sector</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">{selectedProject.category}</p>
                    </div>
                    <div className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Timeframe</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">{selectedProject.duration || 'Standard'}</p>
                    </div>
                  </div>

                  {selectedProject.client && (
                    <div className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Client Entity</span>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">{selectedProject.client}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:w-3/5 p-8 md:p-16 flex flex-col justify-center">
                <div className="space-y-12">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 flex items-center gap-3">
                      <div className="w-8 h-px bg-primary/30"></div> Mission Specification
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-base md:text-xl font-medium leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {selectedProject.techStack && (
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-3">
                        <div className="w-8 h-px bg-primary/30"></div> Logic Architecture
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.techStack.map(tech => (
                          <span key={tech} className="px-5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest hover:border-primary transition-colors cursor-default">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.results && (
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-3">
                        <div className="w-8 h-px bg-primary/30"></div> Operational Gains
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {selectedProject.results.map((result, idx) => (
                          <div key={idx} className="flex gap-5 items-center p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border-l-4 border-primary shadow-sm group hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform">
                              <Icon name="TrendingUp" size={20} />
                            </div>
                            <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200">{result}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-5 pt-8">
                    <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-6 gradient-bg text-white text-center font-black text-xs uppercase tracking-[0.25em] rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 active:scale-95">
                      Launch System Interface <Icon name="ExternalLink" size={18} />
                    </a>
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="sm:w-24 h-20 bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary rounded-2xl transition-all border border-slate-200 dark:border-white/10 hover:shadow-xl group">
                      <Icon name="Github" size={32} className="group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Impact Metrics Section */}
      <section className="py-12 md:py-20 scroll-mt-24 px-4 bg-white dark:bg-slate-950 transition-colors">
        <div className="container mx-auto text-center">
          <div className="reveal mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Impact <span className="gradient-text">Analytics</span></h2>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
            {[0, 1].map((idx) => (
              <div key={idx} className="reveal glass-card rounded-2xl md:rounded-[3rem] p-8 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center text-left shadow-xl hover:shadow-2xl transition-all">
                <div className="lg:w-1/2 w-full">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary rotate-12"><Icon name="Activity" size={28} /></div>
                      <div>
                        <h3 className="text-xl md:text-3xl font-black uppercase text-slate-900 dark:text-white leading-none tracking-tighter">Industrial {idx === 0 ? 'Automation' : 'Optimization'}</h3>
                        <p className="text-primary text-[9px] md:text-[11px] font-black uppercase tracking-widest mt-1">Efficiency Delta</p>
                      </div>
                   </div>
                   <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-medium">
                     Modernizing infrastructure with modular PLC architectures, deterministic real-time communication, and predictive fault monitoring.
                   </p>
                   <div className="flex flex-wrap gap-3">
                      {['Siemens S7-1500', 'WinCC SCADA', 'VFD Profiling'].map(tech => (
                        <span key={tech} className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{tech}</span>
                      ))}
                   </div>
                </div>
                <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4 md:gap-6">
                   <MetricBox value="40%" label="Uptime Gain" />
                   <MetricBox value="25%" label="Energy Saving" />
                   <MetricBox value="30%" label="Speed Boost" />
                   <MetricBox value="60%" label="Safety Factor" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-24 bg-slate-50 dark:bg-slate-900/30 transition-colors">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24 reveal">
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Career <span className="gradient-text">Trajectory</span></h2>
          </div>
          
          <div className="max-w-4xl mx-auto relative px-4">
            {/* Main Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10 -translate-x-1/2"></div>
            
            <div className="space-y-16 md:space-y-24">
              {timeline.map((item, idx) => (
                <div key={item.id} className={`reveal relative flex flex-col md:flex-row items-start gap-8 md:gap-0 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  {/* Content Container */}
                  <div className={`pl-12 md:pl-0 md:w-1/2 w-full ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                    <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-black text-[10px] md:text-xs uppercase tracking-widest mb-4 font-mono">
                      {item.year}
                    </div>
                    <h4 className="text-xl md:text-2xl font-black uppercase text-slate-900 dark:text-white leading-tight tracking-tight mb-3">
                      {item.role} <span className="text-primary">@</span> {item.company}
                    </h4>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Icon Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 md:top-2 z-10 w-12 h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/20 flex items-center justify-center rounded-2xl text-primary shadow-2xl hover:scale-110 transition-transform group">
                     <Icon name={idx === 0 ? "Briefcase" : "Award"} size={22} className="group-hover:rotate-12 transition-transform" />
                  </div>

                  {/* Spacer for Desktop Grid alignment */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-24 bg-white dark:bg-slate-950 transition-colors scroll-mt-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 md:gap-16 items-start max-w-7xl mx-auto">
            <div className="lg:col-span-5 space-y-10">
              <div className="reveal">
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 inline-block">Secure Uplink</span>
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-slate-900 dark:text-white leading-none">
                  Consultation <br/> <span className="gradient-text">Protocol</span>
                </h2>
                <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-medium">Reliable industrial intelligence, precision-tailored for high-stakes operational excellence.</p>
              </div>

              <div className="space-y-6 reveal">
                 <ContactInfoItem icon="Phone" label="Global Comm" value={config.phone} />
                 <ContactInfoItem icon="Mail" label="Encrypted Mail" value={config.email} />
                 <ContactInfoItem icon="MapPin" label="Operations Hub" value={config.location} />
              </div>
              
              <a href={`https://wa.me/${config.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.03] transition-all shadow-2xl shadow-green-500/25 text-sm uppercase tracking-widest active:scale-95">
                <Icon name="MessageCircle" size={26} /> WhatsApp Direct
              </a>
            </div>
            
            <div className="lg:col-span-7 reveal">
              <div className="glass-card p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/10">
                 {formStatus === 'success' ? (
                   <div className="text-center py-16 animate-fadeIn">
                      <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Icon name="CheckCircle" size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">Packet Delivered</h3>
                      <p className="text-slate-500 text-lg font-medium">Your request has been logged. Our engineers will verify and respond shortly.</p>
                   </div>
                 ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6 md:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        <FormInput label="Full Identity" name="name" placeholder="John Connor" />
                        <FormInput label="Comms Channel" name="email" type="email" placeholder="john@domain.com" />
                      </div>
                      <FormInput label="System Objective" name="company" placeholder="e.g. Multi-axis Servo Sync" />
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payload Requirements</label>
                        <textarea required name="message" rows={4} placeholder="Describe technical hurdles and KPIs..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-8 py-5 rounded-3xl outline-none focus:border-primary transition-all text-slate-900 dark:text-white font-medium text-base resize-none" />
                      </div>
                      <button type="submit" disabled={formStatus === 'sending'} className="w-full py-6 gradient-bg text-white font-black text-sm md:text-base uppercase tracking-[0.3em] hover:scale-[1.02] transition-all rounded-3xl shadow-2xl shadow-primary/30 active:scale-95">
                        {formStatus === 'sending' ? 'Transmitting Data...' : 'Initiate Handshake'}
                      </button>
                    </form>
                 )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer config={config} onAdminMode={onAdminMode} />
    </div>
  );
};

const StatBox = ({ value, label }: { value: string; label: string }) => (
  <div className="reveal group">
    <div className="text-3xl md:text-5xl font-black text-primary mb-1 tracking-tighter leading-none group-hover:scale-110 transition-transform origin-center">{value}</div>
    <div className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{label}</div>
  </div>
);

const FormInput = ({ label, name, type = 'text', placeholder }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input required type={type} name={name} placeholder={placeholder} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-8 py-5 rounded-3xl outline-none focus:border-primary transition-all text-slate-900 dark:text-white font-medium text-base shadow-sm" />
  </div>
);

const ContactInfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex gap-6 items-center group">
    <div className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-lg group-hover:-rotate-6">
      <Icon name={icon} size={24} />
    </div>
    <div className="overflow-hidden">
      <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
      <p className="text-base md:text-xl font-bold text-slate-900 dark:text-white truncate tracking-tight">{value}</p>
    </div>
  </div>
);

const MetricBox = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-5 md:p-6 rounded-3xl text-center hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-lg group">
     <div className="text-2xl md:text-3xl font-black text-primary mb-1 group-hover:scale-110 transition-transform">{value}</div>
     <div className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">{label}</div>
  </div>
);