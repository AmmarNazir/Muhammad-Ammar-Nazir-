import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import themeReducer from './themeSlice.ts';
import portfolioReducer from './portfolioSlice.ts';
import blogReducer from './blogSlice.ts';
import authReducer from './authSlice.ts';
import adminReducer from './adminSlice.ts';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    portfolio: portfolioReducer,
    blog: blogReducer,
    auth: authReducer,
    admin: adminReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
