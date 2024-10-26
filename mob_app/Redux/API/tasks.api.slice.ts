import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/Genarals";
import { getItem } from "../../utils/Genarals";
import RoutePaths from "../../utils/RoutePaths";

export const taskApiSlice = createApi({
  reducerPath: "api/tasks",
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
  tagTypes: ["tasks"],

  endpoints: (builder) => ({
    getAlltasks: builder.query({
      query: () => ({
        url: "/tasks/search",
        method: "POST",
        invalidatesTags: ["tasks"],
      }),
    }),

    getAllTasksInRoom: builder.query({
      query: ({ roomId }) => ({
        url: "/tasks/search",
        method: "POST",
        body: {
          pageSize: 100,
          pageNum: 1,
          filter: {
            roomId: { operator: "EQUALS", value: roomId },
          },
        },
        invalidatesTags: ["tasks"],
      }),
    }),

    gettask: builder.query({
      query: (taskId: string) => `/tasks/${taskId}`,
      providesTags: ["tasks"],
    }),

    createtask: builder.mutation({
      query: (formData) => ({
        url: "/tasks",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["tasks"],
    }),

    updatetask: builder.mutation({
      query: ({ taskId, formData }) => ({
        url: `/tasks/${taskId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["tasks"],
    }),

    deletetask: builder.mutation({
      query: (id: String) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tasks"],
    }),
  }),
});

export const {
  useGetAlltasksQuery,
  useGettaskQuery,
  useGetAllTasksInRoomQuery,
  useUpdatetaskMutation,
  useCreatetaskMutation,
  useDeletetaskMutation,
} = taskApiSlice;
