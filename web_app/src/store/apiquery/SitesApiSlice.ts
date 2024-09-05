import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);

export const siteApiSlice = createApi({
  reducerPath: "api/sites",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["sites"],

  endpoints: (builder) => ({
    getAllsites: builder.query({
      query: () => "/sites/search",
      providesTags: ["sites"],
    }),

    getsite: builder.query({
      query: (id: string) => `/sites/${id}`,
      providesTags: ["sites"],
    }),

    createsite: builder.mutation({
      query: (formData) => ({
        url: "/sites",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["sites"],
    }),

    updatesite: builder.mutation({
      query: ({ siteId, formData }) => ({
        url: `/sites/${siteId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["sites"],
    }),
  }),
});

export const {
  useGetAllsitesQuery,
  useGetsiteQuery,
  useUpdatesiteMutation,
  useCreatesiteMutation,
} = siteApiSlice;
