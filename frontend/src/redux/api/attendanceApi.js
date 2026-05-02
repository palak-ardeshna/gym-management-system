import { apiSlice } from '../apiSlice';

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
      query: (params) => ({ url: '/attendance/report', params }),
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useCheckInMutation,
  useMarkAbsentMutation,
  useGetAttendanceReportQuery,
} = attendanceApi;
