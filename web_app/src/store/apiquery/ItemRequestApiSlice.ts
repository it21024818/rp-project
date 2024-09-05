import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);

export const itemrequestApiSlice = createApi({
  reducerPath: "api/procurements",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["procurements"],

  endpoints: (builder) => ({
    getAllitemrequests: builder.query({
      query: () => "/procurements/search",
      providesTags: ["procurements"],
    }),

    getitemrequest: builder.query({
      query: (id: string) => `/itemrequests/${id}`,
      providesTags: ["procurements"],
    }),

    createitemrequest: builder.mutation({
      query: (formData) => ({
        url: "/procurements",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["procurements"],
    }),

    updateitemrequest: builder.mutation({
      query: ({ itemrequestId, formData }) => ({
        url: `/procurements/${itemrequestId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["procurements"],
    }),

    deleteitemrequest: builder.mutation({
      // eslint-disable-next-line @typescript-eslint/ban-types
      query: (id: String) => ({
        url: `/procurements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["procurements"],
    }),
  }),
});

export const {
  useGetAllitemrequestsQuery,
  useGetitemrequestQuery,
  useUpdateitemrequestMutation,
  useCreateitemrequestMutation,
  useDeleteitemrequestMutation,
} = itemrequestApiSlice;
