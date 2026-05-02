import { apiSlice } from '../apiSlice';

export const planApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => '/plans',
      providesTags: ['Plan'],
    }),
  }),
});

export const { useGetPlansQuery } = planApi;
