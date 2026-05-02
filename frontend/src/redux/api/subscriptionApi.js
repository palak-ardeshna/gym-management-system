import { apiSlice } from '../apiSlice';

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    assignPlan: builder.mutation({
      query: (subscriptionData) => ({
        url: '/subscriptions/assign',
        method: 'POST',
        body: subscriptionData,
      }),
      invalidatesTags: ['Subscription', 'Member'],
    }),
    getMembersByStatus: builder.query({
      query: (params) => ({ url: '/subscriptions/members', params }),
      providesTags: ['Subscription', 'Member'],
    }),
  }),
});

export const {
  useAssignPlanMutation,
  useGetMembersByStatusQuery,
} = subscriptionApi;
