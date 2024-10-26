import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/Genarals";
import { getItem } from "../../utils/Genarals";
import RoutePaths from "../../utils/RoutePaths";

const token = getItem(RoutePaths.token);

export const roomApiSlice = createApi({
  reducerPath: "api/rooms",
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
  tagTypes: ["rooms"],

  endpoints: (builder) => ({
    getAllrooms: builder.query({
      query: (userID) => `/rooms/users/${userID}`,
      providesTags: ["rooms"],
    }),
    getroom: builder.query({
      query: (roomId: string) => `/rooms/${roomId}`,
      providesTags: ["rooms"],
    }),
    createroom: builder.mutation({
      query: ({ formData }) => ({
        url: "/rooms",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["rooms"],
    }),
    updateroom: builder.mutation({
      query: ({ roomId, formData }) => ({
        url: `/rooms/${roomId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["rooms"],
    }),
    deleteroom: builder.mutation({
      query: (id: String) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["rooms"],
    }),
    assignRoomAdmin: builder.mutation({
      query: ({ userId, roomId }) => ({
        url: "/rooms/assign",
        method: "PUT",
        params: {
          "user-id": userId,
          "room-id": roomId,
        },
      }),
    }),
    unassignRoomAdmin: builder.mutation({
      query: ({ userId, roomId }) => ({
        url: "/rooms/unassign",
        method: "PUT",
        params: {
          "user-id": userId,
          "room-id": roomId,
        },
      }),
    }),
  }),
});

export const {
  useGetAllroomsQuery,
  useGetroomQuery,
  useUpdateroomMutation,
  useCreateroomMutation,
  useDeleteroomMutation,
  useAssignRoomAdminMutation,
  useUnassignRoomAdminMutation,
} = roomApiSlice;
