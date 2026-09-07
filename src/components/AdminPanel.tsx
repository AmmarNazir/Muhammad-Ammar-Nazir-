import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  FolderGit2, 
  Inbox, 
  Settings, 
  Trash2, 
  Edit3, 
  Check, 
  ExternalLink, 
  FileText, 
  Save, 
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  Plus,
  Sparkles,
  User,
  Wrench,
  BarChart3,
  Tags,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { 
  setAdminOpen, 
  setActiveTab, 
  clearActionMessage,
  fetchAdminOverview,
  fetchAdminMessages,
  fetchAdminBlogs,
  saveBlog,
  deleteBlog,
  saveProject,
  deleteProjectAction,
  saveSettings,
  toggleMessageRead,
  fetchAdminSkills,
  saveSkill,
  deleteSkillAction,
  toggleSkillPublish,
  fetchVisitorAnalytics,
  fetchCategories
} from '../store/adminSlice.ts';
import { loginAdmin, logout } from '../store/authSlice.ts';
import { fetchPortfolioData } from '../store/portfolioSlice.ts';
import { fetchBlogs } from '../store/blogSlice.ts';
import { BlogPost, Project, PortfolioProfile, ProjectCategory } from '../types.ts';
import { getGoogleDriveDirectLink } from '../utils/drive.ts';
import { VisitorsChart } from './admin/VisitorsChart.tsx';
import { CategoryManager } from './admin/CategoryManager.tsx';

export const AdminPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.admin.isOpen);
  const activeTab = useAppSelector((state) => state.admin.activeTab);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const authLoading = useAppSelector((state) => state.auth.loading);
  const authError = useAppSelector((state) => state.auth.error);
  const stats = useAppSelector((state) => state.admin.stats);
  const messages = useAppSelector((state) => state.admin.messages);
  const allPosts = useAppSelector((state) => state.admin.allPosts);
  const actionSuccessMessage = useAppSelector((state) => state.admin.actionSuccessMessage);
  const portfolioProfile = useAppSelector((state) => state.portfolio.profile);
  const projects = useAppSelector((state) => state.portfolio.projects);
  const skills = useAppSelector((state) => state.portfolio.skills);
  const allSkills = useAppSelector((state) => state.admin.allSkills);
  const visitorAnalytics = useAppSelector((state) => state.admin.visitorAnalytics);

  // Login Form state
  const [loginEmail, setLoginEmail] = useState('admin@ammar.dev');
  const [loginPassword, setLoginPassword] = useState('Admin@12345');

  // Hero & About Form states
  const [heroPositionsText, setHeroPositionsText] = useState<string>('');
  const [aboutParagraphsText, setAboutParagraphsText] = useState<string>('');

  // Skill Editor state
  const [skillForm, setSkillForm] = useState<{
    id?: string;
    name: string;
    category: string;
    proficiency: number;
    description: string;
    order: number;
    isPublished: boolean;
  }>({
    name: '',
    category: 'frontend',
    proficiency: 90,
    description: '',
    order: 1,
    isPublished: true
  });

  // Blog Editor state
  const [blogForm, setBlogForm] = useState<{
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    images: string[];
    tags: string;
    readTimeMinutes: number;
    isPublished: boolean;
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    images: [],
    tags: 'MERN, Tech',
    readTimeMinutes: 5,
    isPublished: true
  });
  const [blogPreviewMode, setBlogPreviewMode] = useState(false);
  const [blogNewImageUrl, setBlogNewImageUrl] = useState('');

  // Project Form state
  const [projectForm, setProjectForm] = useState<{
    id?: string;
    title: string;
    slug: string;
    description: string;
    fullDescription: string;
    category: string;
    tags: string;
    coverImage: string;
    images: string[];
    liveUrl: string;
    githubUrl: string;
    driveUrl: string;
    featured: boolean;
    order: number;
  }>({
    title: '',
    slug: '',
    description: '',
    fullDescription: '',
    category: 'fullstack',
    tags: 'MongoDB, Express, React, Node.js',
    coverImage: '',
    images: [],
    liveUrl: '',
    githubUrl: '',
    driveUrl: '',
    featured: false,
    order: 1
  });
  const [projectNewImageUrl, setProjectNewImageUrl] = useState('');

  // Settings Form state
  const [settingsForm, setSettingsForm] = useState<Partial<PortfolioProfile>>({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAdminOverview());
      dispatch(fetchAdminMessages());
      dispatch(fetchAdminBlogs());
      dispatch(fetchAdminSkills());
      dispatch(fetchVisitorAnalytics());
      dispatch(fetchCategories());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (portfolioProfile) {
      setSettingsForm(portfolioProfile);
      setHeroPositionsText(
        portfolioProfile.heroPositions && portfolioProfile.heroPositions.length > 0
          ? portfolioProfile.heroPositions.join(', ')
          : 'MERN Stack Expert, Full Stack Engineer, React & Node.js Specialist'
      );
      setAboutParagraphsText(
        portfolioProfile.aboutText && portfolioProfile.aboutText.length > 0
          ? portfolioProfile.aboutText.join('\n\n')
          : ''
      );
    }
  }, [portfolioProfile]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginAdmin({ email: loginEmail, password: loginPassword }));
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    const positions = heroPositionsText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    const updated = {
      ...settingsForm,
      heroPositions: positions.length > 0 ? positions : ['MERN Stack Expert']
    };
    await dispatch(saveSettings(updated));
    dispatch(fetchPortfolioData());
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    const paragraphs = aboutParagraphsText
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const updated = {
      ...settingsForm,
      aboutText: paragraphs
    };
    await dispatch(saveSettings(updated));
    dispatch(fetchPortfolioData());
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(saveSkill(skillForm));
    dispatch(fetchAdminSkills());
    dispatch(fetchPortfolioData());
    setSkillForm({
      name: '',
      category: 'frontend',
      proficiency: 90,
      description: '',
      order: 1,
      isPublished: true
    });
  };

  const handleEditSkillClick = (sk: any) => {
    setSkillForm({
      id: sk.id,
      name: sk.name,
      category: sk.category,
      proficiency: sk.proficiency,
      description: sk.description || '',
      order: sk.order || 1,
      isPublished: sk.isPublished ?? true
    });
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      saveBlog({
        ...blogForm,
        coverImage: blogForm.coverImage,
        images: blogForm.images,
        tags: blogForm.tags.split(',').map((t) => t.trim())
      })
    );
    dispatch(fetchAdminBlogs());
    dispatch(fetchBlogs());
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      images: [],
      tags: 'MERN, Tech',
      readTimeMinutes: 5,
      isPublished: true
    });
    setBlogNewImageUrl('');
  };

  const handleEditBlogClick = (post: BlogPost) => {
    setBlogForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || '',
      images: post.images || [],
      tags: post.tags.join(', '),
      readTimeMinutes: post.readTimeMinutes,
      isPublished: post.isPublished
    });
    setBlogNewImageUrl('');
  };

  const handleAddBlogImage = () => {
    if (!blogNewImageUrl.trim()) return;
    const directUrl = getGoogleDriveDirectLink(blogNewImageUrl.trim());
    setBlogForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), directUrl]
    }));
    setBlogNewImageUrl('');
  };

  const handleRemoveBlogImage = (indexToRemove: number) => {
    setBlogForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleInsertBlogImageIntoContent = (url: string) => {
    setBlogForm((prev) => ({
      ...prev,
      content: prev.content + `\n\n![Visual Asset](${url})\n`
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      saveProject({
        ...projectForm,
        category: projectForm.category as any,
        coverImage: projectForm.coverImage,
        images: projectForm.images,
        tags: projectForm.tags.split(',').map((t) => t.trim())
      })
    );
    dispatch(fetchPortfolioData());
    setProjectForm({
      title: '',
      slug: '',
      description: '',
      fullDescription: '',
      category: 'fullstack',
      tags: 'MongoDB, Express, React, Node.js',
      coverImage: '',
      images: [],
      liveUrl: '',
      githubUrl: '',
      driveUrl: '',
      featured: false,
      order: 1
    });
    setProjectNewImageUrl('');
  };

  const handleEditProjectClick = (proj: Project) => {
    setProjectForm({
      id: proj.id,
      title: proj.title,
      slug: proj.slug,
      description: proj.description,
      fullDescription: proj.fullDescription || '',
      category: proj.category,
      tags: proj.tags.join(', '),
      coverImage: proj.coverImage,
      images: proj.images || [],
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      driveUrl: proj.driveUrl || '',
      featured: proj.featured,
      order: proj.order
    });
    setProjectNewImageUrl('');
  };

  const handleAddProjectImage = () => {
    if (!projectNewImageUrl.trim()) return;
    const directUrl = getGoogleDriveDirectLink(projectNewImageUrl.trim());
    setProjectForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), directUrl]
    }));
    setProjectNewImageUrl('');
  };

  const handleRemoveProjectImage = (indexToRemove: number) => {
    setProjectForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(saveSettings(settingsForm));
    dispatch(fetchPortfolioData());
  };

  const insertMarkdownTag = (tag: string, placeholder: string = 'text') => {
    setBlogForm((prev) => ({
      ...prev,
      content: prev.content + `\n${tag}${placeholder}\n`
    }));
  };

  const insertGoogleDriveImageHelper = () => {
    const driveLink = prompt('Enter Google Drive File Sharing Link (or any image URL):');
    if (driveLink) {
      const parsed = getGoogleDriveDirectLink(driveLink);
      setBlogForm((prev) => ({
        ...prev,
        content: prev.content + `\n![Image Preview](${parsed})\n`
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl bg-[#0f0f0f] border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:px-6 border-b border-zinc-800 flex items-center justify-between bg-black shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-black font-black text-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>Admin Dashboard</span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Manage hero, about, skills, projects, and articles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Sign out of Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => dispatch(setAdminOpen(false))}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action toast */}
        {actionSuccessMessage && (
          <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => dispatch(clearActionMessage())}
              className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        {!isAuthenticated ? (
          /* JWT Login View */
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-1">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100">
                  Admin Authentication
                </h3>
                <p className="text-xs text-zinc-400">
                  Sign in with verified credentials to manage projects, blogs, and inquiries.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none text-zinc-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  {authLoading ? 'Verifying Credentials...' : 'Sign In'}
                </button>
              </form>

              <div className="p-3 rounded-xl bg-black border border-zinc-800 text-[11px] font-mono text-zinc-400">
                Admin: <span className="text-emerald-400">admin@ammar.dev</span> / <span className="text-emerald-400">Admin@12345</span>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-[#0a0a0a] border-r border-zinc-800 p-3 space-y-1 shrink-0 overflow-y-auto">
              <button
                onClick={() => dispatch(setActiveTab('overview'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('hero'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'hero'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Hero Section</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('about'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'about'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>About Section</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('skills'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'skills'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Skills ({skills.length})</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('projects'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Projects ({projects.length})</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('blogs'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'blogs'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Blogs ({allPosts.length})</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('categories'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <Tags className="w-4 h-4" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('visitors'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'visitors'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Visitors Chart</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('messages'))}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'messages'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4" />
                  <span>Inquiries</span>
                </div>
                {messages.filter((m) => !m.read).length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black font-mono font-bold text-[10px]">
                    {messages.filter((m) => !m.read).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => dispatch(setActiveTab('settings'))}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-zinc-100">
                      Website Overview
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button
                      onClick={() => dispatch(setActiveTab('projects'))}
                      className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <div className="text-3xl font-black font-mono text-emerald-400">
                        {projects.length}
                      </div>
                      <div className="text-xs text-zinc-400 font-bold mt-1">
                        Projects
                      </div>
                    </button>
                    <button
                      onClick={() => dispatch(setActiveTab('skills'))}
                      className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <div className="text-3xl font-black font-mono text-emerald-400">
                        {skills.length}
                      </div>
                      <div className="text-xs text-zinc-400 font-bold mt-1">
                        Skills
                      </div>
                    </button>
                    <button
                      onClick={() => dispatch(setActiveTab('blogs'))}
                      className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <div className="text-3xl font-black font-mono text-emerald-400">
                        {allPosts.length}
                      </div>
                      <div className="text-xs text-zinc-400 font-bold mt-1">
                        Articles
                      </div>
                    </button>
                    <button
                      onClick={() => dispatch(setActiveTab('messages'))}
                      className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <div className="text-3xl font-black font-mono text-emerald-400">
                        {messages.length}
                      </div>
                      <div className="text-xs text-zinc-400 font-bold mt-1">
                        Inquiries
                      </div>
                    </button>
                  </div>

                  {/* Visitor Analytics Highlight */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>Live Audience & Traffic Pulse</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => dispatch(setActiveTab('visitors'))}
                        className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        View Full Traffic Analytics →
                      </button>
                    </div>
                    <VisitorsChart analytics={visitorAnalytics} compact={true} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <button
                      onClick={() => dispatch(setActiveTab('hero'))}
                      className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-emerald-500/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Hero Section</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Customize positions, write-in transition effects, and bio headline.
                      </p>
                    </button>

                    <button
                      onClick={() => dispatch(setActiveTab('about'))}
                      className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-emerald-500/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                        <User className="w-4 h-4" />
                        <span>About Section</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Update background paragraphs, education, and career summary.
                      </p>
                    </button>

                    <button
                      onClick={() => dispatch(setActiveTab('skills'))}
                      className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-emerald-500/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                        <Wrench className="w-4 h-4" />
                        <span>Skills Management</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Add, edit, and reorder frontend, backend, and database technologies.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: HERO MANAGER */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">
                        Hero Section Configuration
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Manage titles, rotating positions, and write-in/write-out transition animation.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveHero} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Logo Stylized Text
                        </label>
                        <input
                          type="text"
                          placeholder="AN"
                          value={settingsForm.logoText || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Location / Tagline
                        </label>
                        <input
                          type="text"
                          placeholder="Based in Islamabad • Graduate IIUI BSIT"
                          value={settingsForm.tagline || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400">
                        Rotating Positions (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="MERN Stack Expert, Full Stack Engineer, React & Node.js Specialist"
                        value={heroPositionsText}
                        onChange={(e) => setHeroPositionsText(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                      />
                      <p className="text-[11px] text-zinc-500">
                        These positions rotate automatically with the write-in / write-out transition effect.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Transition Animation Style
                        </label>
                        <select
                          value={settingsForm.heroTransitionStyle || 'typewriter'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroTransitionStyle: e.target.value as any })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        >
                          <option value="typewriter">Typewriter (Write In / Write Out)</option>
                          <option value="fade">Smooth Fade In / Fade Out</option>
                          <option value="slide">Vertical Slide</option>
                          <option value="flip">3D Flip</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Rotation Delay (ms)
                        </label>
                        <input
                          type="number"
                          min={1500}
                          max={10000}
                          step={200}
                          value={settingsForm.heroTransitionSpeed || 2800}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroTransitionSpeed: Number(e.target.value) })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400">
                        Hero Description
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.bio || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>Google Drive Resume Sharing Link</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://drive.google.com/file/d/..."
                          value={settingsForm.resumeDriveUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, resumeDriveUrl: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Primary CTA Text
                        </label>
                        <input
                          type="text"
                          placeholder="Explore Projects"
                          value={settingsForm.primaryCtaText || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, primaryCtaText: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Hero Settings</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: ABOUT MANAGER */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">
                        About Section Configuration
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Manage biography paragraphs, academic credentials, and educational journey.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAbout} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400">
                        About Paragraphs (separate paragraphs with empty line)
                      </label>
                      <textarea
                        rows={6}
                        value={aboutParagraphsText}
                        onChange={(e) => setAboutParagraphsText(e.target.value)}
                        placeholder="First paragraph...&#10;&#10;Second paragraph..."
                        className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-xs text-zinc-100 focus:border-emerald-500 outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Degree / Program
                        </label>
                        <input
                          type="text"
                          placeholder="BS Information Technology"
                          value={settingsForm.educationDegree || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, educationDegree: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          University / Institution
                        </label>
                        <input
                          type="text"
                          placeholder="International Islamic University Islamabad (IIUI)"
                          value={settingsForm.educationUniversity || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, educationUniversity: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Academic Period
                        </label>
                        <input
                          type="text"
                          placeholder="2021 - 2025"
                          value={settingsForm.educationPeriod || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, educationPeriod: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Coursework Focus
                        </label>
                        <input
                          type="text"
                          placeholder="Software Engineering, Distributed Systems, Data Structures & Cloud Computing"
                          value={settingsForm.educationDetails || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, educationDetails: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save About Settings</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: SKILLS CRUD MANAGER */}
              {activeTab === 'skills' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">
                        {skillForm.id ? 'Edit Skill' : 'Add New Skill'}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Configure core technical proficiencies, categories, and priority display.
                      </p>
                    </div>
                    {skillForm.id && (
                      <button
                        type="button"
                        onClick={() =>
                          setSkillForm({
                            name: '',
                            category: 'frontend',
                            proficiency: 90,
                            description: '',
                            order: 1,
                            isPublished: true
                          })
                        }
                        className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer"
                      >
                        Reset / New Skill
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveSkill} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Skill / Technology Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. React.js"
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] uppercase font-bold text-zinc-400">
                            Category
                          </label>
                          <button
                            type="button"
                            onClick={() => dispatch(setActiveTab('categories'))}
                            className="text-[10px] font-mono text-emerald-400 hover:underline cursor-pointer"
                          >
                            Manage Categories →
                          </button>
                        </div>
                        <select
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        >
                          {(portfolioProfile?.skillCategories && portfolioProfile.skillCategories.length > 0
                            ? portfolioProfile.skillCategories
                            : [
                                { id: 'frontend', label: 'Frontend & UI' },
                                { id: 'backend', label: 'Backend & APIs' },
                                { id: 'database', label: 'Databases & Caching' },
                                { id: 'tools', label: 'Tools & DevOps' }
                              ]
                          ).map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label} ({cat.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Proficiency ({skillForm.proficiency}%)
                        </label>
                        <input
                          type="range"
                          min={20}
                          max={100}
                          value={skillForm.proficiency}
                          onChange={(e) => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
                          className="w-full accent-emerald-500 cursor-pointer mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Short Description / Focus
                        </label>
                        <input
                          type="text"
                          placeholder="Hooks, Redux Toolkit, Context API, SPA architecture"
                          value={skillForm.description}
                          onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Display Priority (Order)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={skillForm.order}
                          onChange={(e) => setSkillForm({ ...skillForm, order: Number(e.target.value) })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={skillForm.isPublished}
                          onChange={(e) => setSkillForm({ ...skillForm, isPublished: e.target.checked })}
                          className="rounded text-emerald-500"
                        />
                        <span>Visible on public site</span>
                      </label>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{skillForm.id ? 'Update Skill' : 'Add Skill'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Skills List */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Configured Skills ({skills.length})
                    </h4>
                    <div className="space-y-2">
                      {skills.map((sk) => (
                        <div
                          key={sk.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-[10px] flex items-center justify-center font-bold">
                              {sk.order}
                            </span>
                            <div>
                              <div className="font-bold text-zinc-100 flex items-center gap-2">
                                <span>{sk.name}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400">
                                  {sk.category}
                                </span>
                              </div>
                              <div className="text-zinc-500 text-[11px] mt-0.5">
                                {sk.proficiency}% • {sk.description || 'Core technical stack'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditSkillClick(sk)}
                              className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 cursor-pointer"
                              title="Edit Skill"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete skill "${sk.name}"?`)) {
                                  dispatch(deleteSkillAction(sk.id));
                                }
                              }}
                              className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/30 cursor-pointer"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BLOGS MANAGER WITH TEXT EDITOR */}
              {activeTab === 'blogs' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-100">
                      {blogForm.id ? 'Edit Article' : 'Write & Publish New Blog'}
                    </h3>
                    {blogForm.id && (
                      <button
                        onClick={() =>
                          setBlogForm({
                            title: '',
                            slug: '',
                            excerpt: '',
                            content: '',
                            coverImage: '',
                            tags: 'MERN, Tech',
                            readTimeMinutes: 5,
                            isPublished: true
                          })
                        }
                        className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer"
                      >
                        Reset / New Article
                      </button>
                    )}
                  </div>

                  {/* Text Editor Form */}
                  <form onSubmit={handleSaveBlog} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Article Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Scaling MERN Apps with Compound Indexes"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="MongoDB, Express, React, Node.js"
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400">
                        Short Excerpt *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Brief summary for social feeds and cards..."
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400">
                        Article Cover Image (URL or Google Drive Link)
                      </label>
                      <input
                        type="text"
                        placeholder="https://drive.google.com/file/d/... or https://..."
                        value={blogForm.coverImage}
                        onChange={(e) => {
                          const val = e.target.value;
                          const directLink = getGoogleDriveDirectLink(val);
                          setBlogForm({ ...blogForm, coverImage: directLink });
                        }}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                      />
                    </div>

                    {blogForm.coverImage && (
                      <div className="flex items-center gap-3 p-2 rounded-xl bg-black border border-zinc-800">
                        <img
                          src={blogForm.coverImage}
                          alt="Cover preview"
                          className="w-16 h-10 object-cover rounded-lg border border-zinc-800"
                        />
                        <div className="text-[11px] font-mono text-zinc-400 truncate flex-1">
                          Cover: {blogForm.coverImage}
                        </div>
                      </div>
                    )}

                    {/* Article Media & Image Gallery Manager */}
                    <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-zinc-800/80">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Article Media & Attachments ({(blogForm.images || []).length})</span>
                        </label>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Auto converts Google Drive links
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Paste image URL or Google Drive share link..."
                          value={blogNewImageUrl}
                          onChange={(e) => setBlogNewImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddBlogImage();
                            }
                          }}
                          className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddBlogImage}
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Media</span>
                        </button>
                      </div>

                      {(blogForm.images && blogForm.images.length > 0) ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                          {blogForm.images.map((imgUrl, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video">
                              <img
                                src={imgUrl}
                                alt={`Media ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleInsertBlogImageIntoContent(imgUrl)}
                                  className="w-full px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold cursor-pointer"
                                  title="Insert into Markdown text"
                                >
                                  Insert in Text
                                </button>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={imgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded bg-zinc-800 text-zinc-200 hover:text-white"
                                    title="Open full size"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBlogImage(i)}
                                    className="p-1 rounded bg-rose-900/80 text-rose-200 hover:bg-rose-800 cursor-pointer"
                                    title="Delete image"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-500 font-mono italic">
                          No images attached yet. Add media above to showcase charts, diagrams, or architecture designs.
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">
                          Article Content (Markdown)
                        </label>
                        <button
                          type="button"
                          onClick={() => setBlogPreviewMode(!blogPreviewMode)}
                          className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer"
                        >
                          {blogPreviewMode ? 'Switch to Editor' : 'Toggle Live Preview'}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-t-xl bg-black border border-zinc-800 text-xs">
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('## ', 'Heading')}
                          className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white font-bold"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('### ', 'Sub-Heading')}
                          className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white font-bold"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('- ', 'List item')}
                          className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white font-mono"
                        >
                          • List
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('```javascript\n', '// code here\n```')}
                          className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white font-mono"
                        >
                          &lt;/&gt; Code
                        </button>
                        <button
                          type="button"
                          onClick={insertGoogleDriveImageHelper}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>+ Drive Image</span>
                        </button>
                      </div>

                      {blogPreviewMode ? (
                        <div className="p-4 rounded-b-xl bg-black border border-t-0 border-zinc-800 min-h-[160px] max-h-[300px] overflow-y-auto text-xs whitespace-pre-wrap font-mono text-zinc-300">
                          {blogForm.content || '(No content to preview yet)'}
                        </div>
                      ) : (
                        <textarea
                          required
                          rows={8}
                          placeholder="Write your article in markdown. Example: ## Introduction..."
                          value={blogForm.content}
                          onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                          className="w-full p-4 rounded-b-xl text-xs font-mono bg-black border border-t-0 border-zinc-800 text-zinc-100 focus:border-emerald-500 outline-none resize-none"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogForm.isPublished}
                          onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                          className="rounded text-emerald-500"
                        />
                        <span>Publish immediately to public website</span>
                      </label>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{blogForm.id ? 'Update Article' : 'Save & Publish'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Blogs List */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Published Articles
                    </h4>
                    <div className="space-y-2">
                      {allPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs"
                        >
                          <div>
                            <div className="font-bold text-zinc-100">
                              {post.title}
                            </div>
                            <div className="text-zinc-500 font-mono text-[11px] mt-0.5">
                              {post.readTimeMinutes} min read • {post.views} views • {post.tags.join(', ')}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditBlogClick(post)}
                              className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 cursor-pointer"
                              title="Edit Article"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete post "${post.title}"?`)) {
                                  dispatch(deleteBlog(post.id));
                                }
                              }}
                              className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/30 cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECTS MANAGER */}
              {activeTab === 'projects' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-100">
                      {projectForm.id ? 'Edit Project' : 'Add New Project'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveProject} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] uppercase font-bold text-zinc-400">
                            Category
                          </label>
                          <button
                            type="button"
                            onClick={() => dispatch(setActiveTab('categories'))}
                            className="text-[10px] font-mono text-emerald-400 hover:underline cursor-pointer"
                          >
                            Manage Categories →
                          </button>
                        </div>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        >
                          {(portfolioProfile?.projectCategories && portfolioProfile.projectCategories.length > 0
                            ? portfolioProfile.projectCategories
                            : [
                                { id: 'fullstack', label: 'MERN & Full Stack' },
                                { id: 'backend', label: 'Backend & APIs' },
                                { id: 'frontend', label: 'Frontend & UI' }
                              ]
                          ).map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label} ({cat.id})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Tags (comma separated) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MongoDB, Express, React, Node.js, TailwindCSS"
                          value={projectForm.tags}
                          onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Cover Image (URL or Google Drive Link)
                        </label>
                        <input
                          type="text"
                          placeholder="https://drive.google.com/file/d/... or https://..."
                          value={projectForm.coverImage}
                          onChange={(e) => {
                            const val = e.target.value;
                            const directLink = getGoogleDriveDirectLink(val);
                            setProjectForm({ ...projectForm, coverImage: directLink });
                          }}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    {projectForm.coverImage && (
                      <div className="flex items-center gap-3 p-2 rounded-xl bg-black border border-zinc-800">
                        <img
                          src={projectForm.coverImage}
                          alt="Cover preview"
                          className="w-16 h-10 object-cover rounded-lg border border-zinc-800"
                        />
                        <div className="text-[11px] font-mono text-zinc-400 truncate flex-1">
                          Cover: {projectForm.coverImage}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400">
                        Short Description *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400">
                        Detailed Project Case Study (Markdown)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Comprehensive case study, key architectural decisions, performance benchmarks, and highlights..."
                        value={projectForm.fullDescription}
                        onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none resize-none font-mono"
                      />
                    </div>

                    {/* Project Screenshots Gallery Manager */}
                    <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-zinc-800/80">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Screenshots & Gallery Images ({(projectForm.images || []).length})</span>
                        </label>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Auto converts Google Drive links
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Paste image URL or Google Drive share link..."
                          value={projectNewImageUrl}
                          onChange={(e) => setProjectNewImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddProjectImage();
                            }
                          }}
                          className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddProjectImage}
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Screenshot</span>
                        </button>
                      </div>

                      {(projectForm.images && projectForm.images.length > 0) ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                          {projectForm.images.map((imgUrl, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video">
                              <img
                                src={imgUrl}
                                alt={`Screenshot ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <a
                                  href={imgUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white"
                                  title="Open in new tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProjectImage(i)}
                                  className="p-1.5 rounded-lg bg-rose-900/80 text-rose-200 hover:bg-rose-800 cursor-pointer"
                                  title="Delete screenshot"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-500 font-mono italic">
                          No screenshots added yet. Add screenshot links above to showcase your UI in modal galleries.
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Live Demo URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          GitHub Repo URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://github.com/..."
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>Google Drive Link</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://drive.google.com/..."
                          value={projectForm.driveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, driveUrl: e.target.value })}
                          className="w-full bg-black border border-emerald-500/30 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                          className="rounded text-emerald-500"
                        />
                        <span>Featured Project</span>
                      </label>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{projectForm.id ? 'Update Project' : 'Save Project'}</span>
                      </button>
                    </div>
                  </form>

                  {/* List of projects */}
                  <div className="space-y-2">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs"
                      >
                        <div>
                          <div className="font-bold text-zinc-100 flex items-center gap-2">
                            <span>{proj.title}</span>
                            {proj.featured && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-zinc-500 font-mono text-[11px] mt-0.5">
                            {proj.category} • {proj.tags.join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProjectClick(proj)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete project "${proj.title}"?`)) {
                                dispatch(deleteProjectAction(proj.id));
                              }
                            }}
                            className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: INBOX / INQUIRIES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-100">
                      Inquiries & WhatsApp Logs
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">
                      {messages.length} message(s) stored
                    </span>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-12 text-center text-xs text-zinc-500 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                      No inquiries registered yet. When visitors fill out the contact form, submissions will be archived here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-5 rounded-2xl border text-xs transition-colors ${
                            msg.read
                              ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
                              : 'bg-emerald-500/5 border-emerald-500/30 text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-zinc-100 text-sm">
                                {msg.name}
                              </span>
                              <span className="text-zinc-500 font-mono">({msg.email})</span>
                              {msg.phone && (
                                <span className="text-emerald-400 font-mono font-semibold">
                                  {msg.phone}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-zinc-500 font-mono text-[10px]">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                              <button
                                onClick={() => dispatch(toggleMessageRead({ id: msg.id, read: !msg.read }))}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-mono border border-zinc-700 hover:bg-zinc-800 cursor-pointer"
                              >
                                {msg.read ? 'Mark Unread' : 'Mark Read'}
                              </button>
                            </div>
                          </div>

                          <div className="mb-2 font-semibold text-zinc-300">
                            Subject: {msg.subject} • Budget: {msg.budget || 'N/A'} • Timeline: {msg.timeline || 'N/A'}
                          </div>

                          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 font-mono text-xs whitespace-pre-wrap text-zinc-300">
                            {msg.formattedWhatsAppText || msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PROFILE & DYNAMIC SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-zinc-100">
                    Profile & Dynamic Link Settings
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Changes here automatically propagate across the frontend and contact pipeline.
                  </p>

                  <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={settingsForm.name || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          Title / Headline
                        </label>
                        <input
                          type="text"
                          value={settingsForm.title || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp Account Number (no +)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="923001234567"
                          value={settingsForm.whatsappNumber || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full bg-black border border-emerald-500/30 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>Google Drive Resume Link</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://drive.google.com/..."
                          value={settingsForm.resumeDriveUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, resumeDriveUrl: e.target.value })}
                          className="w-full bg-black border border-emerald-500/30 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          GitHub Profile URL
                        </label>
                        <input
                          type="text"
                          value={settingsForm.githubUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="text"
                          value={settingsForm.linkedinUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400">
                        Bio / Subtitle
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.bio || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Update Settings</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: CATEGORY TAXONOMY MANAGER */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <CategoryManager />
                </div>
              )}

              {/* TAB 7: VISITORS & TRAFFIC ANALYTICS */}
              {activeTab === 'visitors' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                        <span>Visitor Analytics & Traffic Insights</span>
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Detailed daily session logging, unique audience counts, page views, and traffic origins.
                      </p>
                    </div>
                  </div>

                  <VisitorsChart analytics={visitorAnalytics} compact={false} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
