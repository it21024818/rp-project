import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);

export const companieApiSlice = createApi({
  reducerPath: "api/companies",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["companies"],

  endpoints: (builder) => ({
    getAllcompanies: builder.query({
      query: () => "/companies/search",
      providesTags: ["companies"],
    }),

    getcompanie: builder.query({
      query: (id: string) => `/companies/${id}`,
      providesTags: ["companies"],
    }),

    createcompanie: builder.mutation({
      query: ({ formData }) => ({
        url: "/companies",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["companies"],
    }),

    updatecompanie: builder.mutation({
      query: ({ companyId, formData }) => ({
        url: `/companies/${companyId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["companies"],
    }),

    deletecompanie: builder.mutation({
      // eslint-disable-next-line @typescript-eslint/ban-types
      query: (id: String) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["companies"],
    }),
  }),
});

export const {
  useGetAllcompaniesQuery,
  useGetcompanieQuery,
  useUpdatecompanieMutation,
  useCreatecompanieMutation,
  useDeletecompanieMutation,
} = companieApiSlice;
