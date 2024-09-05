import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);

export const approvalApiSlice = createApi({
  reducerPath: "api/approvals",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["approvals"],

  endpoints: (builder) => ({
    getAllapprovals: builder.query({
      query: () => "/approvals/search",
      providesTags: ["approvals"],
    }),

    getapproval: builder.query({
      query: (id: string) => `/approvals/${id}`,
      providesTags: ["approvals"],
    }),

    passApproval: builder.mutation({
      query: ({ id, isApproved, formData }) => ({
        url: `/approvals/${id}/pass`,
        method: "PUT",
        params: { "is-approved": isApproved },
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllapprovalsQuery,
  useGetapprovalQuery,
  usePassApprovalMutation,
} = approvalApiSlice;
