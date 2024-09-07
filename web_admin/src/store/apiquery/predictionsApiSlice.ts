import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../Utils/Generals';
// const accessToken = localStorage.getItem('accessToken');

const token =
  'yJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjU3NDUyNTcsInN1YiI6IjY2Y2I3MGM1OWY2YTA2MjIxMmNkZjYxNiIsImlzcyI6IlVFRSIsImF1ZCI6WyJsaWdodC1ob3VzZS13ZWItYXBwIiwibGlnaHQtaG91c2UtbW9iaWxlLWFwcCIsImxpZ2h0LWhvdXNlLWFkbWluLWFwcCIsImxpZ2h0LWhvdXNlLWV4dGVuc2lvbiJdLCJleHAiOjE3MjU3NTI0NTd9.FUMHNXCdPQjNikQx9HEOBhIE2VTuzAgWqVIe5GCJmvFJWyXat38d7v7Zmf_3rlBilNCYVDjF4iZ1jAbTwFZpvSAMUgUyzwMA-ecjmuHk9ELQcdRzDT-jsCwMTh2PGf5VuQATvEqSSNNa5Y0Q0X3jXYUMZETJB9YsF76HSROE1rsqkbL7Wd9f4Gnbs3-v37nxwOoSeVkoRxWgmoaU-DYzBfpDhhZ2BTpA19e481sZgT8wdwYDRbBIIuITRcF1Yf2qKCW2aT67ue5F1XEPlnhAR7F5EHbW_r3uKWJH3zmKxcS-fCtZsNGgBLE9AmZ7WHZwRqqe02OrEn4DHe28mwfP0w';

export const predictionApiSlice = createApi({
  reducerPath: 'api/prediction',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
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
    })
  })
});

export const {
  usePredictionMutation,
  useGetPredictionsMutation,
  useGetPredictionQuery
} = predictionApiSlice;
