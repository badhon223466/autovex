
// Updated interfaces for Services and Projects to align with component usage
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  liveLink: string;
  githubLink: string;
  client?: string;
  duration?: string;
  techStack?: string[];
  results?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  photo: string;
}

// New interfaces required by PublicHome and AdminDashboard
export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  company: string;
  role: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface SiteConfig {
  fullName: string;
  title: string;
  experienceYears: string;
  heroIntro: string;
  aboutBio: string;
  profileImage: string;
  logoUrl?: string;
  cvUrl: string;
  email: string;
  phone: string;
  location: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  enabledSections: {
    about: boolean;
    services: boolean;
    portfolio: boolean;
    testimonials: boolean;
    pricing: boolean;
    contact: boolean;
  };
}

export interface AppState {
  config: SiteConfig;
  services: Service[];
  projects: Project[];
  skills: Skill[];
  timeline: TimelineItem[];
  testimonials: Testimonial[];
  pricing: PricingPlan[];
  messages: ContactMessage[];
}

export interface SiteData extends AppState {}
