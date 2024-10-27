import { getItem } from "../../utils/Genarals";
import RoutePaths from "../../utils/RoutePaths";
import { baseApi } from "./base.api.slice";

const token = getItem(RoutePaths.token);

export const usersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<any, string>({
      query: (id) => `/users/${id}`,
    }),
  }),
});

export const { useGetUserQuery } = usersApiSlice;
