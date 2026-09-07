import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, Skill, Experience, PortfolioProfile, BlogPost } from '../types.ts';

interface PortfolioState {
  profile: PortfolioProfile | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  whatsappNumber: string;
  selectedCategory: string;
  selectedProject: Project | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PortfolioState = {
  profile: null,
  projects: [],
  skills: [],
  experiences: [],
  whatsappNumber: '923001234567',
  selectedCategory: 'all',
  selectedProject: null,
  status: 'idle',
  error: null
};

export const fetchPortfolioData = createAsyncThunk(
  'portfolio/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/portfolio');
      if (!res.ok) {
        throw new Error('Failed to load portfolio data');
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    updateProfileLocally: (state, action: PayloadAction<Partial<PortfolioProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setProjectsList: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setSkillsList: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload;
    },
    setExperiencesList: (state, action: PayloadAction<Experience[]>) => {
      state.experiences = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolioData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPortfolioData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload.profile;
        state.projects = action.payload.projects;
        state.skills = action.payload.skills;
        state.experiences = action.payload.experiences;
        if (action.payload.whatsappNumber) {
          state.whatsappNumber = action.payload.whatsappNumber;
        }
      })
      .addCase(fetchPortfolioData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Could not fetch portfolio';
      });
  }
});

export const {
  setSelectedCategory,
  setSelectedProject,
  updateProfileLocally,
  setProjectsList,
  setSkillsList,
  setExperiencesList
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
