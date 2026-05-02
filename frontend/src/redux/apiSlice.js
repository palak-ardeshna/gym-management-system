import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Member', 'Attendance', 'Subscription', 'Plan'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getPlans: builder.query({
      query: () => '/plans',
      providesTags: ['Plan'],
    }),
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Attendance', 'Member', 'Subscription'],
    }),
    getMembers: builder.query({
      query: (params) => ({
        url: '/members',
        params,
      }),
      providesTags: ['Member'],
    }),
    addMember: builder.mutation({
      query: (newMember) => ({
        url: '/members',
        method: 'POST',
        body: newMember,
      }),
      invalidatesTags: ['Member'],
    }),
    updateMember: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/members/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Member'],
    }),
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/members/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Member'],
    }),
    checkIn: builder.mutation({
      query: ({ memberId, status, date }) => ({
        url: '/attendance/check-in',
        method: 'POST',
        body: { memberId, status, date },
      }),
      invalidatesTags: ['Attendance', 'Member'],
    }),
    markAbsent: builder.mutation({
      query: (memberId) => ({
        url: '/attendance/mark-absent',
        method: 'POST',
        body: { memberId },
      }),
      invalidatesTags: ['Attendance', 'Member'],
    }),
    getAttendanceReport: builder.query({
      query: (params) => ({
        url: '/attendance/report',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    assignPlan: builder.mutation({
      query: (subscriptionData) => ({
        url: '/subscriptions/assign',
        method: 'POST',
        body: subscriptionData,
      }),
      invalidatesTags: ['Subscription', 'Member'],
    }),
    getMembersByStatus: builder.query({
      query: (params) => ({
        url: '/subscriptions/members',
        params,
      }),
      providesTags: ['Subscription', 'Member'],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useGetDashboardStatsQuery,
  useGetMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useCheckInMutation,
  useMarkAbsentMutation,
  useGetAttendanceReportQuery,
  useAssignPlanMutation,
  useGetMembersByStatusQuery,
  useGetPlansQuery
} = apiSlice;
