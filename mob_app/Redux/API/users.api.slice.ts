import { baseApi } from "./base.api.slice";

export const usersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<any, string>({
      query: (id) => `/users/${id}`,
    }),
  }),
});

export const { useGetUserQuery } = usersApiSlice;
