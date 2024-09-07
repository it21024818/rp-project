import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
const accessToken = localStorage.getItem("accessToken");

const token = accessToken;

export const usersApiSlice = createApi({
  reducerPath: "api/users",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users/search",
        method: "POST",
      }),
      providesTags: ["Users"],
    }),

    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      // eslint-disable-next-line @typescript-eslint/ban-types
      query: (id: String) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    assignToSite: builder.mutation({
      query: ({ userId, siteId }) => ({
        url: `/users/${userId}/assign`,
        method: "PUT",
        params: { "site-id": siteId },
      }),
      invalidatesTags: ["Users"],
    }),

    unassignFromSite: builder.mutation({
      query: ({ userId, siteId }) => ({
        url: `/users/${userId}/unassign`,
        method: "PUT",
        params: { "site-id": siteId },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useAssignToSiteMutation,
  useUnassignFromSiteMutation,
} = usersApiSlice;
