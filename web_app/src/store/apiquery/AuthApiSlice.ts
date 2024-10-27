import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
const accessToken = localStorage.getItem("accessToken");

const token = accessToken;

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
        url: "/v1/auth/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    googleAuth: builder.mutation({
      query: () => ({
        url: `/v1/auth/oauth/google`,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    handleGoogleRedirect: builder.mutation({
      query: (code: string) => ({
        url: `/v1/auth/oauth/google/redirect?code=${code}`,
        method: "GET",
      }),
      invalidatesTags: ["Auth"],
    }),

    resendRegistrationMail: builder.mutation({
      query: (email) => ({
        url: `/v1/auth/register/resend?email=${email}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `/v1/auth/password/forgot`,
        method: "PUT",
        params: { email },
      }),
      invalidatesTags: ["Auth"],
    }),

    resetPassword: builder.mutation({
      query: ({ password, tokenCode }) => ({
        url: `/v1/auth/password/reset`,
        method: "PUT",
        body: { password, tokenCode: tokenCode },
      }),
      invalidatesTags: ["Auth"],
    }),

    authorizeUser: builder.mutation({
      query: (token) => ({
        url: `/v1/auth/authorize?token-code=${token}`,
        method: "PUT",
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
  useGoogleAuthMutation,
  useHandleGoogleRedirectMutation,
  useAuthorizeUserMutation,
  useChangeUserPasswordMutation,
  useForgotUserPasswordMutation,
  useResendRegistrationMailMutation,
  useResetUserPasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
