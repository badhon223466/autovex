
import React, { useState, useEffect } from 'react';
import { AppState, ContactMessage, Project, Service, Skill, TimelineItem, Testimonial, PricingPlan, SiteConfig } from '../types';
import { storageService } from '../services/storageService';
import { Icon } from '../components/Icon';

type Tab = 'dashboard' | 'content' | 'projects' | 'services' | 'skills' | 'timeline' | 'testimonials' | 'pricing' | 'messages' | 'settings';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [data, setData] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [editingItem, setEditingItem] = useState<{ type: string; item: any } | null>(null);

  useEffect(() => {
    setData(storageService.getData());
  }, []);

  if (!data) return null;

  const handleSave = () => {
    setSaveStatus('saving');
    storageService.saveData(data);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const updateConfig = (updates: Partial<SiteConfig>) => {
    setData({ ...data, config: { ...data.config, ...updates } });
  };

  const deleteItem = (key: keyof AppState, id: string) => {
    const list = data[key] as any[];
    setData({ ...data, [key]: list.filter(item => item.id !== id) });
  };

  const addItem = (key: keyof AppState, newItem: any) => {
    const list = data[key] as any[];
    setData({ ...data, [key]: [...list, newItem] });
    setEditingItem(null);
  };

  const updateItem = (key: keyof AppState, updatedItem: any) => {
    const list = data[key] as any[];
    setData({ ...data, [key]: list.map(item => item.id === updatedItem.id ? updatedItem : item) });
    setEditingItem(null);
  };

  const markMessageRead = (id: string) => {
    const updatedMessages = data.messages.map(m => m.id === id ? { ...m, isRead: true } : m);
    setData({ ...data, messages: updatedMessages });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-white/5 flex flex-col fixed h-full z-30 backdrop-blur-xl">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 font-black text-xl">A</div>
            <div>
              <h1 className="text-lg font-bold">Autovex Admin</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6">
          <NavItem icon="LayoutDashboard" label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <div className="px-4 py-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Content Management</div>
          <NavItem icon="Type" label="Global Copy" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
          <NavItem icon="Box" label="Projects Library" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <NavItem icon="Zap" label="Core Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          <NavItem icon="BarChart" label="Expertise" active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} />
          <NavItem icon="Calendar" label="Experience" active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
          <NavItem icon="MessagesSquare" label="Reviews" active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} />
          <NavItem icon="CreditCard" label="Packages" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
          <div className="px-4 py-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication</div>
          <NavItem icon="Mail" label="Inbox" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} badge={data.messages.filter(m => !m.isRead).length} />
          <NavItem icon="Settings" label="Site Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 space-y-3">
          <button onClick={handleSave} className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95">
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Icon name="Check" size={18} />
                Updated!
              </>
            ) : (
              <>
                <Icon name="Save" size={18} />
                Apply Changes
              </>
            )}
          </button>
          <button onClick={onLogout} className="w-full py-3 text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
            <Icon name="LogOut" size={14} /> System Exit
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <DashboardOverview data={data} />}
          {activeTab === 'content' && <GeneralContentTab config={data.config} onUpdate={updateConfig} />}
          {activeTab === 'projects' && (
            <ListManager 
              title="Projects" 
              items={data.projects} 
              onAdd={() => setEditingItem({ type: 'projects', item: { id: '', name: '', category: '', description: '', image: '', liveLink: '#', githubLink: '#', techStack: [], results: [] } })} 
              onEdit={(item) => setEditingItem({ type: 'projects', item })}
              onDelete={(id) => deleteItem('projects', id)} 
              renderItem={(p) => <div className="font-bold">{p.name} <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded ml-2">{p.category}</span></div>} 
            />
          )}
          {activeTab === 'services' && (
            <ListManager 
              title="Services" 
              items={data.services} 
              onAdd={() => setEditingItem({ type: 'services', item: { id: '', title: '', description: '', icon: 'Cpu' } })} 
              onEdit={(item) => setEditingItem({ type: 'services', item })}
              onDelete={(id) => deleteItem('services', id)} 
              renderItem={(s) => <div className="font-bold">{s.title}</div>} 
            />
          )}
          {activeTab === 'skills' && (
            <ListManager 
              title="Skills" 
              items={data.skills} 
              onAdd={() => setEditingItem({ type: 'skills', item: { id: '', name: '', level: 80 } })} 
              onEdit={(item) => setEditingItem({ type: 'skills', item })}
              onDelete={(id) => deleteItem('skills', id)} 
              renderItem={(s) => <div className="font-bold">{s.name} <span className="text-primary font-mono ml-2">{s.level}%</span></div>} 
            />
          )}
          {activeTab === 'timeline' && (
            <ListManager 
              title="Experience" 
              items={data.timeline} 
              onAdd={() => setEditingItem({ type: 'timeline', item: { id: '', year: '', company: '', role: '', description: '' } })} 
              onEdit={(item) => setEditingItem({ type: 'timeline', item })}
              onDelete={(id) => deleteItem('timeline', id)} 
              renderItem={(t) => <div className="font-bold">{t.role} @ {t.company} <span className="text-[10px] text-slate-400 font-mono ml-2">{t.year}</span></div>} 
            />
          )}
          {activeTab === 'testimonials' && (
            <ListManager 
              title="Reviews" 
              items={data.testimonials} 
              onAdd={() => setEditingItem({ type: 'testimonials', item: { id: '', name: '', role: '', feedback: '', photo: '' } })} 
              onEdit={(item) => setEditingItem({ type: 'testimonials', item })}
              onDelete={(id) => deleteItem('testimonials', id)} 
              renderItem={(t) => <div className="font-bold">{t.name} <span className="text-[10px] text-slate-400 font-mono ml-2">{t.role}</span></div>} 
            />
          )}
          {activeTab === 'pricing' && (
            <ListManager 
              title="Packages" 
              items={data.pricing} 
              onAdd={() => setEditingItem({ type: 'pricing', item: { id: '', name: '', price: '', features: [], isPopular: false } })} 
              onEdit={(item) => setEditingItem({ type: 'pricing', item })}
              onDelete={(id) => deleteItem('pricing', id)} 
              renderItem={(p) => <div className="font-bold">{p.name} <span className="text-primary font-mono ml-2">{p.price}</span></div>} 
            />
          )}
          {activeTab === 'messages' && <MessagesManager messages={data.messages} onMarkRead={markMessageRead} onDelete={(id) => deleteItem('messages', id)} />}
          {activeTab === 'settings' && <SettingsTab config={data.config} onUpdate={updateConfig} />}
        </div>
      </main>

      {/* Item Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                {editingItem.item.id ? 'Edit' : 'Create'} {editingItem.type.slice(0, -1)}
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl hover:text-primary transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <ItemForm 
              type={editingItem.type} 
              item={editingItem.item} 
              onSave={(item) => editingItem.item.id ? updateItem(editingItem.type as any, item) : addItem(editingItem.type as any, { ...item, id: Math.random().toString(36).substring(2, 9) })} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ItemForm: React.FC<{ type: string; item: any; onSave: (item: any) => void }> = ({ type, item, onSave }) => {
  const [formData, setFormData] = useState({ ...item });

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="space-y-6">
      {type === 'projects' && (
        <>
          <AdminInput label="Project Name" value={formData.name} onChange={v => handleChange('name', v)} />
          <AdminInput label="Category" value={formData.category} onChange={v => handleChange('category', v)} />
          <AdminTextarea label="Description" value={formData.description} onChange={v => handleChange('description', v)} />
          <AdminInput label="Image URL" value={formData.image} onChange={v => handleChange('image', v)} />
          <div className="grid grid-cols-2 gap-6">
            <AdminInput label="Live Link" value={formData.liveLink} onChange={v => handleChange('liveLink', v)} />
            <AdminInput label="Github Link" value={formData.githubLink} onChange={v => handleChange('githubLink', v)} />
          </div>
        </>
      )}
      {type === 'services' && (
        <>
          <AdminInput label="Service Title" value={formData.title} onChange={v => handleChange('title', v)} />
          <AdminInput label="Icon Name (Lucide)" value={formData.icon} onChange={v => handleChange('icon', v)} />
          <AdminTextarea label="Description" value={formData.description} onChange={v => handleChange('description', v)} />
        </>
      )}
      {type === 'skills' && (
        <>
          <AdminInput label="Skill Name" value={formData.name} onChange={v => handleChange('name', v)} />
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Expertise Level ({formData.level}%)</label>
            <input 
              type="range" min="0" max="100" 
              value={formData.level} 
              onChange={e => handleChange('level', parseInt(e.target.value))} 
              className="w-full accent-primary h-2 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        </>
      )}
      {type === 'timeline' && (
        <>
          <div className="grid grid-cols-2 gap-6">
            <AdminInput label="Duration / Year" value={formData.year} onChange={v => handleChange('year', v)} />
            <AdminInput label="Company / Employer" value={formData.company} onChange={v => handleChange('company', v)} />
          </div>
          <AdminInput label="Official Role" value={formData.role} onChange={v => handleChange('role', v)} />
          <AdminTextarea label="Experience Details" value={formData.description} onChange={v => handleChange('description', v)} />
        </>
      )}
      {type === 'testimonials' && (
        <>
          <AdminInput label="Client Name" value={formData.name} onChange={v => handleChange('name', v)} />
          <AdminInput label="Position / Company" value={formData.role} onChange={v => handleChange('role', v)} />
          <AdminTextarea label="Client Feedback" value={formData.feedback} onChange={v => handleChange('feedback', v)} />
          <AdminInput label="Photo URL" value={formData.photo} onChange={v => handleChange('photo', v)} />
        </>
      )}
      {type === 'pricing' && (
        <>
          <AdminInput label="Package Name" value={formData.name} onChange={v => handleChange('name', v)} />
          <AdminInput label="Display Price" value={formData.price} onChange={v => handleChange('price', v)} />
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
            <input type="checkbox" checked={formData.isPopular} onChange={e => handleChange('isPopular', e.target.checked)} className="w-5 h-5 accent-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Highlight as Popular</span>
          </div>
        </>
      )}

      <button onClick={() => onSave(formData)} className="w-full py-5 gradient-bg text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 mt-4">
        Save Specification
      </button>
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void; badge?: number }> = ({ icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
  >
    <div className="flex items-center gap-4">
      <Icon name={icon} size={20} />
      <span className="font-bold text-sm">{label}</span>
    </div>
    {badge && badge > 0 ? <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${active ? 'bg-white text-primary' : 'bg-primary text-white animate-pulse'}`}>{badge}</span> : null}
  </button>
);

const DashboardOverview: React.FC<{ data: AppState }> = ({ data }) => (
  <div className="space-y-10">
    <header className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Dashboard Overview</h2>
        <p className="text-slate-500 mt-2">System heartbeat is normal. Welcome, {data.config.fullName}.</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <StatCard icon="Box" label="Projects" value={data.projects.length.toString()} trend="Active library" />
      <StatCard icon="Mail" label="Unread" value={data.messages.filter(m => !m.isRead).length.toString()} trend="Inbound traffic" />
      <StatCard icon="Zap" label="Expertise" value={data.skills.length.toString()} trend="Defined modules" />
      <StatCard icon="Globe" label="Network" value="Active" trend="System live" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm backdrop-blur-md">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><Icon name="Activity" className="text-primary" /> System Logs</h3>
        <div className="space-y-6">
          <ActivityItem label="Admin initialized" detail="Session token generated" time="Now" icon="ShieldCheck" />
          <ActivityItem label="Database connected" detail="Ready for data mutations" time="Just now" icon="Database" />
          <ActivityItem label="Storage synced" detail="Local storage bridge established" time="2 mins ago" icon="RefreshCw" />
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm backdrop-blur-md">
        <h3 className="text-xl font-bold mb-8">Rapid Deployment</h3>
        <div className="grid grid-cols-1 gap-4 text-left">
           <AdminQuickAction icon="Plus" label="Quick Project" />
           <AdminQuickAction icon="MessageSquare" label="Review Messages" />
           <AdminQuickAction icon="User" label="Update Bio" />
        </div>
      </div>
    </div>
  </div>
);

const StatCard: React.FC<{ icon: string; label: string; value: string; trend: string }> = ({ icon, label, value, trend }) => (
  <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col gap-6 group hover:shadow-2xl hover:shadow-primary/5 transition-all">
    <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Icon name={icon} size={24} /></div>
        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-tight">{trend}</span>
    </div>
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{value}</p>
    </div>
  </div>
);

const ActivityItem: React.FC<{ label: string; detail: string; time: string; icon: string }> = ({ label, detail, time, icon }) => (
  <div className="flex gap-6 items-start py-4 border-b border-slate-100 dark:border-white/5 last:border-0 group">
    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors"><Icon name={icon} size={18} /></div>
    <div className="flex-1">
      <div className="flex justify-between">
        <p className="text-sm font-bold text-slate-800 dark:text-white">{label}</p>
        <span className="text-[10px] text-slate-400 font-bold uppercase">{time}</span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{detail}</p>
    </div>
  </div>
);

const AdminQuickAction: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors"><Icon name={icon} size={18} /></div>
    <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{label}</span>
  </button>
);

const GeneralContentTab: React.FC<{ config: SiteConfig; onUpdate: (updates: Partial<SiteConfig>) => void }> = ({ config, onUpdate }) => (
  <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-12 border border-slate-200 dark:border-white/5 space-y-12">
    <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Identity & Presence</h2>
        <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Global Data</div>
    </header>
    <div className="grid md:grid-cols-2 gap-10">
      <AdminInput label="Full Identity Name" value={config.fullName} onChange={v => onUpdate({ fullName: v })} />
      <AdminInput label="Professional Role Title" value={config.title} onChange={v => onUpdate({ title: v })} />
      <AdminInput label="Years of Experience (e.g. 8+)" value={config.experienceYears} onChange={v => onUpdate({ experienceYears: v })} />
      <div className="md:col-span-2">
        <AdminTextarea label="Hero Hook Statement" value={config.heroIntro} onChange={v => onUpdate({ heroIntro: v })} />
      </div>
      <div className="md:col-span-2">
        <AdminTextarea label="Master Biography" value={config.aboutBio} onChange={v => onUpdate({ aboutBio: v })} />
      </div>
      <AdminInput label="Profile Image Asset URL" value={config.profileImage} onChange={v => onUpdate({ profileImage: v })} />
      <AdminInput label="Custom Branding Logo URL" value={config.logoUrl || ''} onChange={v => onUpdate({ logoUrl: v })} />
      <AdminInput label="Primary Contact Email" value={config.email} onChange={v => onUpdate({ email: v })} />
      <AdminInput label="Operational Hub / Location" value={config.location} onChange={v => onUpdate({ location: v })} />
      <AdminInput label="Contact Direct Line" value={config.phone} onChange={v => onUpdate({ phone: v })} />
      <AdminInput label="CV Asset Storage URL" value={config.cvUrl} onChange={v => onUpdate({ cvUrl: v })} />
    </div>
  </div>
);

const SettingsTab: React.FC<{ config: SiteConfig; onUpdate: (updates: Partial<SiteConfig>) => void }> = ({ config, onUpdate }) => (
  <div className="space-y-10">
    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-12 border border-slate-200 dark:border-white/5">
      <h3 className="text-xl font-bold mb-10 italic uppercase tracking-tighter">SEO Optimization</h3>
      <div className="space-y-8">
        <AdminInput label="Search Metadata Title" value={config.seo.metaTitle} onChange={v => onUpdate({ seo: { ...config.seo, metaTitle: v } })} />
        <AdminTextarea label="Search Metadata Description" value={config.seo.metaDescription} onChange={v => onUpdate({ seo: { ...config.seo, metaDescription: v } })} />
      </div>
    </div>
    
    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-12 border border-slate-200 dark:border-white/5">
      <h3 className="text-xl font-bold mb-10 italic uppercase tracking-tighter">Visibility Control</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(config.enabledSections).map(([key, val]) => (
          <button 
            key={key} 
            onClick={() => onUpdate({ enabledSections: { ...config.enabledSections, [key as keyof typeof config.enabledSections]: !val } })}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${val ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-white/5 opacity-50 text-slate-400'}`}
          >
            <Icon name={val ? 'Eye' : 'EyeOff'} size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">{key} Section</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const MessagesManager: React.FC<{ messages: ContactMessage[]; onMarkRead: (id: string) => void; onDelete: (id: string) => void }> = ({ messages, onMarkRead, onDelete }) => (
  <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden">
    <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
      <h2 className="text-2xl font-bold italic uppercase tracking-tighter">Correspondence Buffer</h2>
      <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{messages.length} Records</span>
    </div>
    <div className="divide-y divide-slate-100 dark:divide-white/5">
      {messages.length === 0 ? (
        <div className="p-24 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-300"><Icon name="MailSearch" size={32} /></div>
            <p className="text-slate-500 text-lg font-bold italic">No active data transmission from clients.</p>
        </div>
      ) : (
        [...messages].reverse().map(m => (
          <div key={m.id} className={`p-8 flex flex-col md:flex-row justify-between gap-8 transition-colors ${!m.isRead ? 'bg-primary/5' : ''}`}>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-primary font-bold text-xl">{m.name[0].toUpperCase()}</div>
                <div>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-black italic uppercase text-slate-800 dark:text-white">{m.name}</span>
                        {!m.isRead && <span className="px-2 py-0.5 rounded bg-primary text-white text-[8px] font-black uppercase tracking-widest">Priority</span>}
                    </div>
                    <span className="text-xs text-primary font-bold tracking-tight">{m.email}</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed bg-slate-50 dark:bg-black/20 p-6 rounded-3xl border border-slate-100 dark:border-white/5 italic">{m.message}</p>
            </div>
            <div className="md:text-right flex flex-col justify-between items-end shrink-0">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{new Date(m.date).toLocaleString()}</span>
              <div className="flex gap-4 mt-6">
                 <button onClick={() => onDelete(m.id)} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all active:scale-90"><Icon name="Trash2" size={18} /></button>
                 {!m.isRead && (
                    <button onClick={() => onMarkRead(m.id)} className="p-4 px-6 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-90 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">Resolve <Icon name="Check" size={16} /></button>
                 )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const ListManager: React.FC<{ title: string; items: any[]; onAdd: () => void; onEdit: (item: any) => void; onDelete: (id: string) => void; renderItem: (item: any) => React.ReactNode }> = ({ title, items, onAdd, onEdit, onDelete, renderItem }) => (
  <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden">
    <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
      <h2 className="text-2xl font-bold italic uppercase tracking-tighter">{title} Module</h2>
      <button onClick={onAdd} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"><Icon name="Plus" size={20} /> Deploy New</button>
    </div>
    <div className="divide-y divide-slate-100 dark:divide-white/5">
      {items.length === 0 ? (
        <div className="p-20 text-center">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No entries found in this subsystem.</p>
        </div>
      ) : (
        items.map(item => (
          <div key={item.id} className="p-6 px-10 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><Icon name="Database" size={20} /></div>
              <div className="text-lg text-slate-700 dark:text-slate-200 tracking-tight">{renderItem(item)}</div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => onEdit(item)} className="p-3 text-slate-400 hover:text-primary transition-colors active:scale-90"><Icon name="Edit3" size={20} /></button>
              <button onClick={() => onDelete(item.id)} className="p-3 text-slate-400 hover:text-red-500 transition-colors active:scale-90"><Icon name="Trash2" size={20} /></button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const AdminInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white dark:focus:bg-white/10 transition-all text-base font-bold tracking-tight" 
    />
  </div>
);

const AdminTextarea: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
    <textarea 
      value={value} 
      rows={4}
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white dark:focus:bg-white/10 transition-all text-base font-bold tracking-tight resize-none" 
    />
  </div>
);
