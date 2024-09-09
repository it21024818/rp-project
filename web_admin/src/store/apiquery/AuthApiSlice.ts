import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const accessToken = localStorage.getItem('accessToken');

const BASE_URL = process.env.REACT_APP_EXTERNAL_URL;

// import { token } from '../../Utils/Generals';
const token = accessToken;

export const authApiSlice = createApi({
  reducerPath: 'api/auth',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Auth'],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (formdata) => ({
        url: `/v1/auth/login`,
        method: 'POST',
        body: formdata
      }),
      invalidatesTags: ['Auth']
    }),

    register: builder.mutation({
      query: (formData) => ({
        url: '/v1/auth/register',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Auth']
    }),

    resendRegistrationMail: builder.mutation({
      query: (email) => ({
        url: `/v1/auth/register/resend?email=${email}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    }),

    authorizeUser: builder.mutation({
      query: (token) => ({
        url: `/v1/auth/authorize?token-code=${token}`,
        method: 'PUT'
      })
    }),

    forgotUserPassword: builder.mutation<void, { email: string }>({
      query: (email) => ({
        url: `/auth/password/forgot`,
        method: 'PUT',
        params: { email }
      })
    }),

    resetUserPassword: builder.mutation({
      query: ({ password, tokenCode }) => ({
        url: `/auth/password/reset`,
        method: 'PUT',
        body: { password, 'token-code': tokenCode }
      })
    }),

    changeUserPassword: builder.mutation({
      query: ({ email, password, oldPassword }) => ({
        url: `/auth/password/change`,
        method: 'PUT',
        params: { email },
        body: { password, oldPassword: oldPassword }
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useAuthorizeUserMutation,
  useChangeUserPasswordMutation,
  useForgotUserPasswordMutation,
  useResendRegistrationMailMutation,
  useResetUserPasswordMutation
} = authApiSlice;
