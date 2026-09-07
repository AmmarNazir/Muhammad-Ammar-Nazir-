import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BlogPost } from '../types.ts';

interface BlogState {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  searchTerm: string;
  selectedTag: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  selectedPost: null,
  searchTerm: '',
  selectedTag: null,
  status: 'idle',
  error: null
};

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/blogs');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchSingleBlog = createAsyncThunk(
  'blog/fetchSingleBlog',
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/blogs/${slug}`);
      if (!res.ok) throw new Error('Post not found');
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setSelectedPost: (state, action: PayloadAction<BlogPost | null>) => {
      state.selectedPost = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload;
    },
    setPostsList: (state, action: PayloadAction<BlogPost[]>) => {
      state.posts = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch blogs';
      })
      .addCase(fetchSingleBlog.fulfilled, (state, action) => {
        state.selectedPost = action.payload;
      });
  }
});

export const { setSelectedPost, setSearchTerm, setSelectedTag, setPostsList } = blogSlice.actions;
export default blogSlice.reducer;
