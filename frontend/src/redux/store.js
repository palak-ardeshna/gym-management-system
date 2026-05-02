import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './slices/authSlice';

// Side-effect imports — register all endpoints into apiSlice via injectEndpoints.
import './api/authApi';
import './api/memberApi';
import './api/planApi';
import './api/dashboardApi';
import './api/attendanceApi';
import './api/subscriptionApi';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
