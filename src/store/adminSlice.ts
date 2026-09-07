import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContactMessage, BlogPost, Project, Skill, Experience, PortfolioProfile, VisitorAnalytics, ProjectCategory } from '../types.ts';
import { RootState } from './index.ts';

interface AdminStats {
  totalProjects: number;
  totalPosts: number;
  publishedPosts: number;
  totalSkills: number;
  totalMessages: number;
  unreadMessages: number;
}

interface AdminState {
  isOpen: boolean;
  activeTab: 'overview' | 'hero' | 'about' | 'projects' | 'skills' | 'blogs' | 'categories' | 'visitors' | 'messages' | 'settings' | 'experiences';
  stats: AdminStats | null;
  visitorAnalytics: VisitorAnalytics | null;
  categories: {
    projectCategories: ProjectCategory[];
    blogCategories: ProjectCategory[];
    skillCategories: ProjectCategory[];
  } | null;
  messages: ContactMessage[];
  allPosts: BlogPost[];
  allSkills: Skill[];
  editingBlog: BlogPost | null;
  editingProject: Project | null;
  editingSkill: Skill | null;
  editingExperience: Experience | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  actionSuccessMessage: string | null;
  error: string | null;
}

const initialState: AdminState = {
  isOpen: false,
  activeTab: 'overview',
  stats: null,
  visitorAnalytics: null,
  categories: null,
  messages: [],
  allPosts: [],
  allSkills: [],
  editingBlog: null,
  editingProject: null,
  editingSkill: null,
  editingExperience: null,
  status: 'idle',
  actionSuccessMessage: null,
  error: null
};

// Async Thunks
export const fetchAdminOverview = createAsyncThunk(
  'admin/fetchOverview',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch admin overview');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchAdminMessages = createAsyncThunk(
  'admin/fetchMessages',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch messages');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchAdminBlogs = createAsyncThunk(
  'admin/fetchBlogs',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch('/api/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch admin blogs');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchVisitorAnalytics = createAsyncThunk(
  'admin/fetchVisitorAnalytics',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch('/api/admin/visitors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch visitor analytics');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const saveCategories = createAsyncThunk(
  'admin/saveCategories',
  async (
    payload: {
      projectCategories?: ProjectCategory[];
      blogCategories?: ProjectCategory[];
      skillCategories?: ProjectCategory[];
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update categories');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const saveBlog = createAsyncThunk(
  'admin/saveBlog',
  async (blogData: Partial<BlogPost> & { id?: string }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const isEdit = Boolean(blogData.id);
    const url = isEdit ? `/api/admin/blogs/${blogData.id}` : '/api/admin/blogs';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save blog');
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'admin/deleteBlog',
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete blog');
      return id;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const saveProject = createAsyncThunk(
  'admin/saveProject',
  async (projectData: Partial<Project> & { id?: string }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const isEdit = Boolean(projectData.id);
    const url = isEdit ? `/api/admin/projects/${projectData.id}` : '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      if (!res.ok) throw new Error('Failed to save project');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const deleteProjectAction = createAsyncThunk(
  'admin/deleteProject',
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete project');
      return id;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const saveSettings = createAsyncThunk(
  'admin/saveSettings',
  async (settingsData: Partial<PortfolioProfile>, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settingsData)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const toggleMessageRead = createAsyncThunk(
  'admin/toggleMessageRead',
  async ({ id, read }: { id: string; read: boolean }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch(`/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ read })
      });
      if (!res.ok) throw new Error('Failed to update message status');
      return { id, read };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchAdminSkills = createAsyncThunk(
  'admin/fetchSkills',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch('/api/admin/skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch admin skills');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const saveSkill = createAsyncThunk(
  'admin/saveSkill',
  async (skillData: Partial<Skill> & { id?: string }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const isEdit = Boolean(skillData.id);
    const url = isEdit ? `/api/admin/skills/${skillData.id}` : '/api/admin/skills';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(skillData)
      });
      if (!res.ok) throw new Error('Failed to save skill');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const deleteSkillAction = createAsyncThunk(
  'admin/deleteSkill',
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete skill');
      return id;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const toggleSkillPublish = createAsyncThunk(
  'admin/toggleSkillPublish',
  async ({ id, isPublished }: { id: string; isPublished: boolean }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await fetch(`/api/admin/skills/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished })
      });
      if (!res.ok) throw new Error('Failed to toggle publish status');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<AdminState['activeTab']>) => {
      state.activeTab = action.payload;
    },
    setEditingBlog: (state, action: PayloadAction<BlogPost | null>) => {
      state.editingBlog = action.payload;
    },
    setEditingProject: (state, action: PayloadAction<Project | null>) => {
      state.editingProject = action.payload;
    },
    setEditingSkill: (state, action: PayloadAction<Skill | null>) => {
      state.editingSkill = action.payload;
    },
    setEditingExperience: (state, action: PayloadAction<Experience | null>) => {
      state.editingExperience = action.payload;
    },
    clearActionMessage: (state) => {
      state.actionSuccessMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      })
      // Messages
      .addCase(fetchAdminMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(toggleMessageRead.fulfilled, (state, action) => {
        const msg = state.messages.find(m => m.id === action.payload.id);
        if (msg) {
          msg.read = action.payload.read;
        }
      })
      // Blogs
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.allPosts = action.payload;
      })
      .addCase(saveBlog.fulfilled, (state) => {
        state.editingBlog = null;
        state.actionSuccessMessage = 'Blog post saved successfully!';
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.allPosts = state.allPosts.filter(p => p.id !== action.payload);
        state.actionSuccessMessage = 'Blog post deleted';
      })
      // Projects
      .addCase(saveProject.fulfilled, (state) => {
        state.editingProject = null;
        state.actionSuccessMessage = 'Project saved successfully!';
      })
      .addCase(deleteProjectAction.fulfilled, (state, action) => {
        state.actionSuccessMessage = 'Project removed';
      })
      // Settings
      .addCase(saveSettings.fulfilled, (state) => {
        state.actionSuccessMessage = 'Portfolio profile settings updated!';
      })
      // Skills
      .addCase(fetchAdminSkills.fulfilled, (state, action) => {
        state.allSkills = action.payload;
      })
      .addCase(saveSkill.fulfilled, (state) => {
        state.editingSkill = null;
        state.actionSuccessMessage = 'Skill saved successfully!';
      })
      .addCase(deleteSkillAction.fulfilled, (state, action) => {
        state.allSkills = state.allSkills.filter(s => s.id !== action.payload);
        state.actionSuccessMessage = 'Skill removed successfully!';
      })
      .addCase(toggleSkillPublish.fulfilled, (state, action) => {
        const skill = state.allSkills.find(s => s.id === action.payload.id);
        if (skill) {
          skill.isPublished = action.payload.isPublished;
        }
        state.actionSuccessMessage = `Skill ${action.payload.isPublished ? 'published' : 'unpublished'}!`;
      })
      // Visitor Analytics
      .addCase(fetchVisitorAnalytics.fulfilled, (state, action) => {
        state.visitorAnalytics = action.payload;
      })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(saveCategories.fulfilled, (state, action) => {
        state.categories = {
          projectCategories: action.payload.projectCategories,
          blogCategories: action.payload.blogCategories,
          skillCategories: action.payload.skillCategories
        };
        state.actionSuccessMessage = 'Categories updated successfully!';
      });
  }
});

export const {
  setAdminOpen,
  setActiveTab,
  setEditingBlog,
  setEditingProject,
  setEditingSkill,
  setEditingExperience,
  clearActionMessage
} = adminSlice.actions;

export default adminSlice.reducer;
