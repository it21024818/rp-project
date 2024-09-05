import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);

export const invoiceApiSlice = createApi({
  reducerPath: "api/invoices",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["invoices"],

  endpoints: (builder) => ({
    getAllinvoices: builder.query({
      query: () => "/invoices/search",
      providesTags: ["invoices"],
    }),

    getinvoice: builder.query({
      query: (id: string) => `/invoices/${id}`,
      providesTags: ["invoices"],
    }),

    createinvoice: builder.mutation({
      query: ({ formData }) => ({
        url: "/invoices",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["invoices"],
    }),

      
  }),
});

export const {
  useGetAllinvoicesQuery,
  useGetinvoiceQuery,
  useCreateinvoiceMutation,
} = invoiceApiSlice;
