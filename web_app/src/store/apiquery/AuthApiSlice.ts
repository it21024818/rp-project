import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";

export const authApiSlice = createApi({
  reducerPath: "api/auth",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Auth"],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (formdata) => ({
        url: `/v1/auth/login`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    resendRegistrationMail: builder.mutation<void, { email: string }>({
      query: (email) => ({
        url: `/auth/register/resend`,
        method: "POST",
        params: { email },
      }),
    }),

    authorizeUser: builder.mutation<void, { "token-code": string }>({
      query: (token) => ({
        url: `/auth/authorize`,
        method: "PUT",
        params: { "token-code": token },
      }),
    }),

    forgotUserPassword: builder.mutation<void, { email: string }>({
      query: (email) => ({
        url: `/auth/password/forgot`,
        method: "PUT",
        params: { email },
      }),
    }),

    resetUserPassword: builder.mutation({
      query: ({ password, tokenCode }) => ({
        url: `/auth/password/reset`,
        method: "PUT",
        body: { password, "token-code": tokenCode },
      }),
    }),

    changeUserPassword: builder.mutation({
      query: ({ email, password, oldPassword }) => ({
        url: `/auth/password/change`,
        method: "PUT",
        params: { email },
        body: { password, oldPassword: oldPassword },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useAuthorizeUserMutation,
  useChangeUserPasswordMutation,
  useForgotUserPasswordMutation,
  useResendRegistrationMailMutation,
  useResetUserPasswordMutation,
} = authApiSlice;
