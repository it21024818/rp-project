import { baseApi } from "./base.api.slice";

export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        tokens: { accessToken: string; refreshToken: string };
        user: {
          _id: string;
          email: string;
          firstName: string;
          lastName: string;
        };
      },
      { email: string; password: string }
    >({
      query: (data) => ({
        url: `/auth/login`,
        method: "POST",
        body: { ...data, audience: "MOBILE_APP" },
      }),
    }),
    register: builder.mutation({
      query: (userDto) => ({
        url: "/auth/register",
        method: "POST",
        body: userDto,
      }),
    }),
    resendRegistrationMail: builder.mutation<void, { email: string }>({
      query: (email) => ({
        url: `/auth/register/resend`,
        method: "POST",
        params: { email },
      }),
    }),
    authorizeUser: builder.mutation<void, string>({
      query: (token) => ({
        url: `/auth/authorize`,
        method: "PUT",
        params: { "token-code": token },
      }),
    }),
    forgotUserPassword: builder.mutation<void, string>({
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
