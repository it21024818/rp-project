import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "../customBaseQuery";

export const reviewsApiSlice = createApi({
  reducerPath: "api/reviews",
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
  tagTypes: ["reviews"],

  endpoints: (builder) => ({
    reviews: builder.mutation({
      query: ({ predictionId, formData }) => ({
        url: `v1/feedback?prediction-id=${predictionId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const { useReviewsMutation } = reviewsApiSlice;
