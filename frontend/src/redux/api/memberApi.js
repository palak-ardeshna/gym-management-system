import { apiSlice } from '../apiSlice';

export const memberApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query({
      query: (params) => ({ url: '/members', params }),
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
  }),
});

export const {
  useGetMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = memberApi;
