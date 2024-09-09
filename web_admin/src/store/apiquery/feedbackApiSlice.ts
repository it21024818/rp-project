import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = process.env.REACT_APP_EXTERNAL_URL;
const accessToken = localStorage.getItem('accessToken');

// import { token } from '../../Utils/Generals';
const token = accessToken;

export const feedbackApiSlice = createApi({
  reducerPath: 'api/feedback',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['feedback'],

  endpoints: (builder) => ({
    feedback: builder.mutation({
      query: (formData) => ({
        url: `/v1/feedback`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['feedback']
    }),
    getfeedbacks: builder.mutation({
      query: (formData) => ({
        url: `/v1/feedback/search`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['feedback']
    }),
    getfeedback: builder.query({
      query: (id: string) => `/v1/feedback/${id}`,
      providesTags: ['feedback']
    }),
    getfeedbackAnalytics: builder.query({
      query: ({ frequency, startDate, endDate }) =>
        `/v1/feedback/analytics?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['feedback']
    })
  })
});

export const {
  useFeedbackMutation,
  useGetfeedbacksMutation,
  useGetfeedbackQuery,
  useGetfeedbackAnalyticsQuery
} = feedbackApiSlice;
