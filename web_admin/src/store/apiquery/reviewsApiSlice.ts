import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = process.env.REACT_APP_EXTERNAL_URL;
const accessToken = localStorage.getItem('accessToken');

import { customBaseQuery } from '../customBaseQuery';

// import { token } from '../../Utils/Generals';
const token = accessToken;

export const reviewsApiSlice = createApi({
  reducerPath: 'api/reviews',
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
  tagTypes: ['reviews'],

  endpoints: (builder) => ({
    reviews: builder.mutation({
      query: ({ predictionId, formData }) => ({
        url: `v1/feedback?prediction-id=${predictionId}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['reviews']
    })
  })
});

export const { useReviewsMutation } = reviewsApiSlice;
