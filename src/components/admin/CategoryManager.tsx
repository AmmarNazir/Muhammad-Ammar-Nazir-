import React, { useState, useEffect } from 'react';
import { 
  Tags, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Save, 
  Layers, 
  BookOpen, 
  Wrench, 
  FolderGit2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/index.ts';
import { saveCategories, fetchCategories } from '../../store/adminSlice.ts';
import { fetchPortfolioData } from '../../store/portfolioSlice.ts';
import { ProjectCategory } from '../../types.ts';

const DEFAULT_PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'fullstack', label: 'MERN & Full Stack' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'frontend', label: 'Frontend & UI' },
  { id: 'mobile', label: 'Mobile Applications' },
  { id: 'ai', label: 'AI & Machine Learning' }
];

const DEFAULT_BLOG_CATEGORIES: ProjectCategory[] = [
  { id: 'Tech', label: 'Technology' },
  { id: 'MERN', label: 'MERN Stack' },
  { id: 'Architecture', label: 'Architecture & Scaling' },
  { id: 'Database', label: 'Databases & Performance' },
  { id: 'Career', label: 'Career & Engineering' }
];

const DEFAULT_SKILL_CATEGORIES: ProjectCategory[] = [
  { id: 'frontend', label: 'Frontend & UI' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'database', label: 'Databases & Caching' },
  { id: 'tools', label: 'Tools & DevOps' }
];

export const CategoryManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const portfolioProfile = useAppSelector((state) => state.portfolio.profile);
  const projects = useAppSelector((state) => state.portfolio.projects);
  const allPosts = useAppSelector((state) => state.admin.allPosts);
  const skills = useAppSelector((state) => state.portfolio.skills);

  const [activeSection, setActiveSection] = useState<'projects' | 'blogs' | 'skills'>('projects');

  // Local state for categories
  const [projectCats, setProjectCats] = useState<ProjectCategory[]>(DEFAULT_PROJECT_CATEGORIES);
  const [blogCats, setBlogCats] = useState<ProjectCategory[]>(DEFAULT_BLOG_CATEGORIES);
  const [skillCats, setSkillCats] = useState<ProjectCategory[]>(DEFAULT_SKILL_CATEGORIES);

  // Form state for adding/editing category
  const [editingId, setEditingId] = useState<string | null>(null);
  const [catId, setCatId] = useState('');
  const [catLabel, setCatLabel] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync from profile when loaded
  useEffect(() => {
    if (portfolioProfile) {
      if (portfolioProfile.projectCategories && portfolioProfile.projectCategories.length > 0) {
        setProjectCats(portfolioProfile.projectCategories);
      }
      if (portfolioProfile.blogCategories && portfolioProfile.blogCategories.length > 0) {
        setBlogCats(portfolioProfile.blogCategories);
      }
      if (portfolioProfile.skillCategories && portfolioProfile.skillCategories.length > 0) {
        setSkillCats(portfolioProfile.skillCategories);
      }
    }
  }, [portfolioProfile]);

  const handleLabelChange = (val: string) => {
    setCatLabel(val);
    if (!editingId) {
      // Auto-generate slug from label for new categories
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setCatId(autoSlug);
    }
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = catId.trim().toLowerCase();
    const cleanLabel = catLabel.trim();

    if (!cleanId || !cleanLabel) {
      setErrorMessage('Both Category ID (slug) and Display Label are required.');
      return;
    }

    if (activeSection === 'projects') {
      if (editingId) {
        setProjectCats(prev => prev.map(c => (c.id === editingId ? { id: cleanId, label: cleanLabel } : c)));
      } else {
        if (projectCats.some(c => c.id.toLowerCase() === cleanId)) {
          setErrorMessage(`Category ID "${cleanId}" already exists.`);
          return;
        }
        setProjectCats(prev => [...prev, { id: cleanId, label: cleanLabel }]);
      }
    } else if (activeSection === 'blogs') {
      if (editingId) {
        setBlogCats(prev => prev.map(c => (c.id === editingId ? { id: cleanId, label: cleanLabel } : c)));
      } else {
        if (blogCats.some(c => c.id.toLowerCase() === cleanId)) {
          setErrorMessage(`Category ID "${cleanId}" already exists.`);
          return;
        }
        setBlogCats(prev => [...prev, { id: cleanId, label: cleanLabel }]);
      }
    } else if (activeSection === 'skills') {
      if (editingId) {
        setSkillCats(prev => prev.map(c => (c.id === editingId ? { id: cleanId, label: cleanLabel } : c)));
      } else {
        if (skillCats.some(c => c.id.toLowerCase() === cleanId)) {
          setErrorMessage(`Category ID "${cleanId}" already exists.`);
          return;
        }
        setSkillCats(prev => [...prev, { id: cleanId, label: cleanLabel }]);
      }
    }

    // Reset input form
    setEditingId(null);
    setCatId('');
    setCatLabel('');
  };

  const handleEditClick = (category: ProjectCategory) => {
    setEditingId(category.id);
    setCatId(category.id);
    setCatLabel(category.label);
    setErrorMessage(null);
  };

  const handleDelete = (idToDelete: string) => {
    if (activeSection === 'projects') {
      if (projectCats.length <= 1) {
        setErrorMessage('You must keep at least one project category.');
        return;
      }
      setProjectCats(prev => prev.filter(c => c.id !== idToDelete));
    } else if (activeSection === 'blogs') {
      if (blogCats.length <= 1) {
        setErrorMessage('You must keep at least one blog category/topic.');
        return;
      }
      setBlogCats(prev => prev.filter(c => c.id !== idToDelete));
    } else if (activeSection === 'skills') {
      if (skillCats.length <= 1) {
        setErrorMessage('You must keep at least one skill category.');
        return;
      }
      setSkillCats(prev => prev.filter(c => c.id !== idToDelete));
    }
    if (editingId === idToDelete) {
      setEditingId(null);
      setCatId('');
      setCatLabel('');
    }
  };

  const handleSaveToBackend = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await dispatch(saveCategories({
        projectCategories: projectCats,
        blogCategories: blogCats,
        skillCategories: skillCats
      })).unwrap();
      await dispatch(fetchPortfolioData()).unwrap();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to save categories');
    } finally {
      setIsSaving(false);
    }
  };

  // Get current active category list
  const currentList = 
    activeSection === 'projects' ? projectCats :
    activeSection === 'blogs' ? blogCats : skillCats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Tags className="w-5 h-5 text-emerald-400" />
            <span>Category Taxonomy Management</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Create, update, and organize categories for Projects, Blog Articles, and Technical Skills.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveToBackend}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-md"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Changes...' : 'Save All Categories'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Categories saved to database and live filters updated!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 w-full sm:w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveSection('projects');
            setEditingId(null);
            setCatId('');
            setCatLabel('');
            setErrorMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'projects'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Project Categories ({projectCats.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSection('blogs');
            setEditingId(null);
            setCatId('');
            setCatLabel('');
            setErrorMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'blogs'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Blog Topics ({blogCats.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSection('skills');
            setEditingId(null);
            setCatId('');
            setCatLabel('');
            setErrorMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSection === 'skills'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Skill Groups ({skillCats.length})</span>
        </button>
      </div>

      {/* Add / Edit Category Form */}
      <form onSubmit={handleAddOrUpdate} className="p-5 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-400">
            {editingId ? `Edit Category: ${editingId}` : `Add New ${activeSection === 'projects' ? 'Project Category' : activeSection === 'blogs' ? 'Blog Topic' : 'Skill Group'}`}
          </h4>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setCatId('');
                setCatLabel('');
              }}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-zinc-400">
              Display Label *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cloud & DevOps"
              value={catLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-zinc-400">
              Slug Identifier (Key) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. devops"
              value={catId}
              onChange={(e) => setCatId(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{editingId ? 'Update Category' : 'Add Category'}</span>
          </button>
        </div>
      </form>

      {/* List of Configured Categories */}
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
          Configured Categories ({currentList.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentList.map((cat) => {
            // Count matching items
            let usageCount = 0;
            if (activeSection === 'projects') {
              usageCount = projects.filter(p => p.category === cat.id).length;
            } else if (activeSection === 'blogs') {
              usageCount = allPosts.filter(p => p.tags.some(t => t.toLowerCase() === cat.id.toLowerCase() || t.toLowerCase() === cat.label.toLowerCase())).length;
            } else if (activeSection === 'skills') {
              usageCount = skills.filter(s => s.category === cat.id).length;
            }

            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isEditing
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-100 text-sm">{cat.label}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black border border-zinc-800 text-emerald-400">
                      {cat.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    Used by {usageCount} {activeSection === 'projects' ? 'project(s)' : activeSection === 'blogs' ? 'article(s)' : 'skill(s)'}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEditClick(cat)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
