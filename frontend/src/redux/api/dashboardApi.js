import { apiSlice } from '../apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Attendance', 'Member', 'Subscription'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
