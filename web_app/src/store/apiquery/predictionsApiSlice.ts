import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
const accessToken = localStorage.getItem("accessToken");

const token = accessToken;

export const predictionApiSlice = createApi({
  reducerPath: "api/prediction",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Prediction"],

  endpoints: (builder) => ({
    prediction: builder.mutation({
      query: (formData) => ({
        url: `/v1/predictions`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Prediction"],
    }),
  }),
});

export const { usePredictionMutation } = predictionApiSlice;
