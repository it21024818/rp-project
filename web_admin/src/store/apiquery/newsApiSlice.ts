import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = process.env.REACT_APP_EXTERNAL_URL;
const accessToken = localStorage.getItem('accessToken');
// import { token } from '../../Utils/Generals';
const token = accessToken;

import { customBaseQuery } from '../customBaseQuery';

export const newsApiSlice = createApi({
  reducerPath: 'api/news',
  // baseQuery: fetchBaseQuery({
  //   baseUrl: BASE_URL,
  //   prepareHeaders(headers) {
  //     if (token) {
  //       headers.set('Authorization', `Bearer ${token}`);
  //     }
  //     return headers;
  //   }
  // }),
  baseQuery: customBaseQuery,
  tagTypes: ['news'],

  endpoints: (builder) => ({
    getnews: builder.mutation({
      query: (formData) => ({
        url: `/v1/news-sources/search`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['news']
    }),
    getnewsById: builder.query({
      query: (id: string) => `/v1/news-sources/${id}`,
      providesTags: ['news']
    }),
    getnewsFinalAnalytics: builder.query({
      query: ({ sourceId, frequency, startDate, endDate }) =>
        `/v1/news-sources/${sourceId}/analytics/final?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['news']
    }),
    getnewsSentimentAnalytics: builder.query({
      query: ({ sourceId, frequency, startDate, endDate }) =>
        `/v1/news-sources/${sourceId}/analytics/sentiment?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['news']
    }),
    getnewsSarcasmAnalytics: builder.query({
      query: ({ sourceId, frequency, startDate, endDate }) =>
        `/v1/news-sources/${sourceId}/analytics/sarcasm?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['news']
    }),
    getnewsQualityAnalytics: builder.query({
      query: ({ sourceId, frequency, startDate, endDate }) =>
        `/v1/news-sources/${sourceId}/analytics/text-quality?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['news']
    }),
    getnewsBiasAnalytics: builder.query({
      query: ({ sourceId, frequency, startDate, endDate }) =>
        `/v1/news-sources/${sourceId}/analytics/political-bias?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['news']
    })
  })
});

export const {
  useGetnewsByIdQuery,
  useGetnewsMutation,
  useGetnewsFinalAnalyticsQuery,
  useGetnewsBiasAnalyticsQuery,
  useGetnewsQualityAnalyticsQuery,
  useGetnewsSarcasmAnalyticsQuery,
  useGetnewsSentimentAnalyticsQuery
} = newsApiSlice;
