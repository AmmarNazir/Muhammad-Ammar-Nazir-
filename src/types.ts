export interface ProjectCategory {
  id: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  category: string;
  tags: string[];
  coverImage: string;
  images?: string[];
  liveUrl?: string;
  githubUrl?: string;
  driveUrl?: string; // Google Drive document or preview link
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  iconName?: string;
  description?: string;
  order: number;
  isPublished?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  current: boolean;
  description: string[];
  technologies: string[];
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  images?: string[];
  tags: string[];
  readTimeMinutes: number;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  budget?: string;
  timeline?: string;
  message: string;
  formattedWhatsAppText: string;
  read: boolean;
  createdAt: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  details?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogImage: string;
  robots: string;
  googleSiteVerification?: string;
  author: string;
  twitterHandle?: string;
  structuredDataJson?: string;
}

export interface PortfolioProfile {
  name: string;
  title: string;
  bio: string;
  aboutText: string[];
  email: string;
  whatsappNumber: string;
  location: string;
  education: EducationItem[];
  resumeDriveUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  stats: { label: string; value: string }[];
  logoText?: string;
  navItems?: NavItem[];
  heroPositions?: string[];
  heroTransitionStyle?: 'typewriter' | 'fade' | 'slide' | 'flip';
  projectCategories?: ProjectCategory[];
  blogCategories?: ProjectCategory[];
  skillCategories?: ProjectCategory[];
  seoSettings?: SeoSettings;
}

export interface VisitorMetric {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface VisitorBreakdownItem {
  name: string;
  count: number;
  percentage: number;
}

export interface VisitorAnalytics {
  totalVisitors: number;
  todayVisitors: number;
  totalPageViews: number;
  avgDuration: string;
  bounceRate: string;
  activeNow?: number;
  history: VisitorMetric[];
  deviceBreakdown?: VisitorBreakdownItem[];
  referrerBreakdown?: VisitorBreakdownItem[];
  topPages?: { path: string; count: number }[];
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
}

export interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
