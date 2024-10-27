import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  { defaultAuth?: boolean }
> = async (args, api, extra) => {
  const user = (api.getState() as RootState).user;
  const baseUrl = "https://detect-lighthouse.me/api/v1";
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, api) => {
      const accessToken = user?.tokens?.accessToken;
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  const res = await rawBaseQuery(args, api, extra);
  const path = res.meta?.request.url.replace(baseUrl, "");
  const status = res.meta?.response?.status;
  const method = res.meta?.request.method;

  if (status && status < 300) {
    console.log(
      `[API  ] [${method}] request completed with [${status}] to [${path}]`
    );
  } else {
    console.warn(
      `[API  ] [${method}] request completed with [${status}] to [${path}]`
    );
    console.error(res.error);
  }
  return res;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: dynamicBaseQuery,
  endpoints: () => ({}),
});
