import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = process.env.REACT_APP_EXTERNAL_URL;
const accessToken = localStorage.getItem('accessToken');

// import { token } from '../../Utils/Generals';
const token = accessToken;

export const usersApiSlice = createApi({
  reducerPath: 'api/users',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Users'],

  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `/v1/users/${id}`,
      providesTags: ['Users']
    }),

    deleteUser: builder.mutation({
      // eslint-disable-next-line @typescript-eslint/ban-types
      query: (id: String) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Users']
    }),

    getAllUsersList: builder.mutation({
      query: (formData) => ({
        url: `/v1/users/search`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Users']
    }),

    assignToSite: builder.mutation({
      query: ({ userId, siteId }) => ({
        url: `/users/${userId}/assign`,
        method: 'PUT',
        params: { 'site-id': siteId }
      }),
      invalidatesTags: ['Users']
    }),

    unassignFromSite: builder.mutation({
      query: ({ userId, siteId }) => ({
        url: `/users/${userId}/unassign`,
        method: 'PUT',
        params: { 'site-id': siteId }
      }),
      invalidatesTags: ['Users']
    })
  })
});

export const {
  useGetAllUsersListMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useAssignToSiteMutation,
  useUnassignFromSiteMutation
} = usersApiSlice;
