import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = process.env.REACT_APP_EXTERNAL_URL;
const accessToken = localStorage.getItem('accessToken');

import { customBaseQuery } from '../customBaseQuery';

// import { token } from '../../Utils/Generals';
const token = accessToken;
export const predictionApiSlice = createApi({
  reducerPath: 'api/prediction',
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
  tagTypes: ['Prediction'],

  endpoints: (builder) => ({
    prediction: builder.mutation({
      query: (formData) => ({
        url: `/v1/predictions`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Prediction']
    }),
    getPredictions: builder.mutation({
      query: (formData) => ({
        url: `/v1/predictions/search`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Prediction']
    }),
    getPrediction: builder.query({
      query: (id: string) => `/v1/predictions/${id}`,
      providesTags: ['Prediction']
    }),
    getpredictionFinalAnalytics: builder.query({
      query: ({ frequency, startDate, endDate }) =>
        `/v1/predictions/analytics/final?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['Prediction']
    }),
    getpredictionSentimentAnalytics: builder.query({
      query: ({ frequency, startDate, endDate }) =>
        `/v1/predictions/analytics/sentiment?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['Prediction']
    }),
    getpredictionSarcasmAnalytics: builder.query({
      query: ({ frequency, startDate, endDate }) =>
        `/v1/predictions/analytics/sarcasm?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['Prediction']
    }),
    getpredictionQualityAnalytics: builder.query({
      query: ({ frequency, startDate, endDate }) =>
        `/v1/predictions/analytics/text-quality?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['Prediction']
    }),
    getpredictionBiasAnalytics: builder.query({
      query: ({ frequency, startDate, endDate }) =>
        `/v1/predictions/analytics/political-bias?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['Prediction']
    }),
    getusageAnalytics: builder.query({
      query: ({ frequency, startDate, endDate }) =>
        `/v1/audited-requests/analytics?frequency=${frequency}&start-date=${startDate}&end-date=${endDate}`,
      providesTags: ['Prediction']
    }),
    getrepotExcel: builder.query({
      query: ({ includeFeedback, startDate, endDate }) =>
        `/v1/predictions/report/xlsx?startDate=${startDate}&endDate=${endDate}&includeFeedback=${includeFeedback}`,
      providesTags: ['Prediction']
    }),
    getrepotCsv: builder.query({
      query: ({ includeFeedback, startDate, endDate }) =>
        `/v1/predictions/report/csv?startDate=${startDate}&endDate=${endDate}&includeFeedback=${includeFeedback}`,
      providesTags: ['Prediction']
    })
  })
});

export const {
  usePredictionMutation,
  useGetPredictionsMutation,
  useGetPredictionQuery,
  useGetpredictionFinalAnalyticsQuery,
  useGetpredictionSentimentAnalyticsQuery,
  useGetpredictionSarcasmAnalyticsQuery,
  useGetpredictionQualityAnalyticsQuery,
  useGetpredictionBiasAnalyticsQuery,
  useGetusageAnalyticsQuery,
  useGetrepotExcelQuery,
  useGetrepotCsvQuery
} = predictionApiSlice;
