
import { AppState, ContactMessage } from '../types';

const defaultData: AppState = {
  config: {
    fullName: 'Md Badhon',
    title: 'Industrial Automation Engineer',
    experienceYears: '8+',
    heroIntro: 'specializing in PLC programming, HMI design, SCADA development, and VFD commissioning. I work with all major automation brands to deliver reliable, optimized, and factory-ready solutions.',
    aboutBio: "I'm a professional Industrial Automation Engineer with hands-on experience in PLC programming, HMI design, SCADA development and VFD commissioning. I work with all major automation brands and deliver reliable, optimized and factory-ready automation solutions. My expertise spans across Siemens, Mitsubishi, Delta, LS, Allen-Bradley, Schneider, and Omron platforms.",
    profileImage: 'https://i.postimg.cc/KzX3p4X5/54541.jpg',
    logoUrl: 'https://i.postimg.cc/2SL2sXqQ/Asset-2.png',
    cvUrl: '#',
    email: 'engineer@autovex.com',
    phone: '+880 1XXX-XXXXXX',
    location: 'Dhaka, Bangladesh',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    seo: {
      metaTitle: 'Md Badhon | Industrial Automation Engineer',
      metaDescription: 'Professional Industrial Automation & PLC/HMI Training Portal'
    },
    enabledSections: {
      about: true,
      services: true,
      portfolio: true,
      testimonials: true,
      pricing: true,
      contact: true
    }
  },
  services: [
    { id: '1', title: 'PLC Programming', description: 'Custom ladder logic, structured text, and function block programming for complex motion control.', icon: 'Cpu' },
    { id: '2', title: 'HMI/SCADA', description: 'Intuitive operator interfaces with real-time monitoring, alarm management, and reporting.', icon: 'Monitor' },
    { id: '3', title: 'VFD Solutions', description: 'Complete variable frequency drive solutions from selection to commissioning and tuning.', icon: 'Zap' },
    { id: '4', title: 'Troubleshooting', description: 'Expert diagnosis and rapid resolution of automation system faults to minimize downtime.', icon: 'Activity' },
    { id: '5', title: 'Commissioning', description: 'End-to-end testing, I/O checkout, loop tuning, and factory acceptance testing (FAT).', icon: 'CheckCircle' },
    { id: '6', title: 'Panel & Retrofit', description: 'Professional control panel design, wiring, and legacy system upgrades with modern technology.', icon: 'Layers' }
  ],
  projects: [
    { 
      id: 'p1', 
      name: 'Packaging Line Automation', 
      description: 'Full-scale automation of a high-speed bottling line. Optimized cycle times and integrated safety protocols.', 
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 
      category: 'FMCG',
      liveLink: '#',
      githubLink: '#',
      client: 'Global Beverage Corp',
      duration: '4 Months',
      techStack: ['Siemens S7-1500', 'TIA Portal', 'Comfort Panel HMI', 'G120 VFDs'],
      results: ['40% Throughput Increase', 'Zero Safety Incidents', 'Reduced Energy Waste by 15%']
    },
    { 
      id: 'p2', 
      name: 'Smart Pump Control System', 
      description: 'Distributed control system for city-wide water management using Modbus TCP and remote SCADA monitoring.', 
      image: 'https://images.unsplash.com/photo-1581092160602-40aa08e78837?w=800&q=80', 
      category: 'Infrastructure',
      liveLink: '#',
      githubLink: '#',
      client: 'City Water Authority',
      duration: '6 Months',
      techStack: ['Mitsubishi Q-Series', 'GOT2000 HMI', 'IGNITION SCADA', 'Modbus TCP'],
      results: ['Remote Control from HQ', 'Automated Leak Detection', '24/7 Real-time Logging']
    },
    { 
      id: 'p3', 
      name: 'Textile Machine Retrofit', 
      description: 'Legacy machine modernization. Replaced outdated relays with PLC-based logic and precision multi-axis drives.', 
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', 
      category: 'Manufacturing',
      liveLink: '#',
      githubLink: '#',
      client: 'Textile Innovators Ltd',
      duration: '3 Months',
      techStack: ['Delta AS300 PLC', 'DOP-100 HMI', 'ASDA-A2 Servo', 'EtherCAT'],
      results: ['50% Less Maintenance Downtime', 'Precision Synchronization', 'User-friendly Recipe Management']
    }
  ],
  skills: [
    { id: 's1', name: 'Siemens (S7-1200, S7-1500)', level: 95 },
    { id: 's2', name: 'Mitsubishi (FX, Q Series)', level: 90 },
    { id: 's3', name: 'Delta (DVP-SV2, AS Series)', level: 92 },
    { id: 's4', name: 'HMI/SCADA Systems', level: 88 },
    { id: 's5', name: 'VFD & Drive Systems', level: 90 },
    { id: 's6', name: 'Allen-Bradley/Schneider', level: 85 }
  ],
  timeline: [
    { id: 't1', year: '2021 - Present', company: 'Senior Automation Engineer', role: 'Leading Industrial Solutions', description: 'Lead automation projects for major manufacturing plants specializing in Siemens and Allen-Bradley systems.' },
    { id: 't2', year: '2018 - 2021', company: 'Automation Engineer', role: 'Tech-Automation Ltd', description: 'Designed and implemented PLC/HMI systems for textile and food processing industries.' },
    { id: 't3', year: '2016 - 2018', company: 'Junior Automation Engineer', role: 'Industrial Dynamics', description: 'Started career with VFD installations, panel wiring, and basic PLC programming.' }
  ],
  testimonials: [
    { 
      id: 't1', 
      name: 'Anisur Rahman', 
      role: 'Plant Owner, Rahman Industries', 
      feedback: 'Complete factory automation delivered on time and within budget. The SCADA system provides real-time visibility we never had before. Excellent expertise!', 
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' 
    }
  ],
  pricing: [
    { id: 'pr1', name: 'Technical Consultation', price: '$100', features: ['System Audit', 'Efficiency Analysis', 'Troubleshooting'], isPopular: false },
    { id: 'pr2', name: 'Full Automation Design', price: '$1500', features: ['Full PLC/HMI Logic', 'Hardware Selection', 'Deployment', '1 Month Support'], isPopular: true }
  ],
  messages: []
};

const savedData = typeof window !== 'undefined' ? localStorage.getItem('autovex_app_state') : null;
export const siteData: AppState = savedData ? JSON.parse(savedData) : defaultData;

export const storageService = {
  getData: () => siteData,
  saveData: (data: AppState) => {
    Object.assign(siteData, data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('autovex_app_state', JSON.stringify(siteData));
    }
  },
  addMessage: (message: any) => {
    const newMessage: ContactMessage = {
      ...message,
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
      isRead: false
    };
    siteData.messages.push(newMessage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('autovex_app_state', JSON.stringify(siteData));
    }
  }
};
