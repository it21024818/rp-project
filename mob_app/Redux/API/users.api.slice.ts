import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/Genarals";
import { getItem } from "../../utils/Genarals";
import RoutePaths from "../../utils/RoutePaths";

const token = getItem(RoutePaths.token);

export const usersApiSlice = createApi({
  reducerPath: "api/users",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    async prepareHeaders(headers) {
      const token = await getItem(RoutePaths.token);
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
        invalidatesTags: ["Users"],
      }),
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),
    getAllUsersInRoom: builder.query({
      query: (roomId) => ({
        url: "/users/search",
        method: "POST",
        body: {
          pageSize: 100,
          pageNum: 1,
          filter: {
            roomIds: { operator: "IN", value: [roomId] },
          },
        },
        invalidatesTags: ["Users"],
      }),
    }),
    assignUserToRoom: builder.mutation({
      query: ({ email, roomId }) => ({
        url: "/users/assign",
        method: "PUT",
        params: {
          email: email,
          "room-id": roomId,
        },
      }),
    }),
    unassignUserFromRoom: builder.mutation({
      query: ({ roomId, userId }) => ({
        url: "/users/unassign",
        method: "PUT",
        params: {
          "user-id": userId,
          "room-id": roomId,
        },
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useGetAllUsersInRoomQuery,
  useUnassignUserFromRoomMutation,
  useAssignUserToRoomMutation,
  useDeleteUserMutation,
} = usersApiSlice;
