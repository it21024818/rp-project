import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);

export const itemApiSlice = createApi({
  reducerPath: "api/items",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["items"],

  endpoints: (builder) => ({
    getAllitems: builder.query({
      query: () => "/items/search",
      providesTags: ["items"],
    }),

    getitem: builder.query({
      query: (id: string) => `/items/${id}`,
      providesTags: ["items"],
    }),

    createitem: builder.mutation({
      query: (formData) => ({
        url: "/items",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["items"],
    }),

    updateitem: builder.mutation({
      query: ({ itemId, formData }) => ({
        url: `/items/${itemId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["items"],
    }),
  }),
});

export const {
  useGetAllitemsQuery,
  useGetitemQuery,
  useUpdateitemMutation,
  useCreateitemMutation,
} = itemApiSlice;
