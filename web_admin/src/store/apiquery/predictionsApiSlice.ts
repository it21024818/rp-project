import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../Utils/Generals';
// const accessToken = localStorage.getItem('accessToken');

const token =
  'eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjU3Mjk5NjMsInN1YiI6IjY2Y2I3MGM1OWY2YTA2MjIxMmNkZjYxNiIsImlzcyI6IlVFRSIsImF1ZCI6WyJsaWdodC1ob3VzZS13ZWItYXBwIiwibGlnaHQtaG91c2UtbW9iaWxlLWFwcCIsImxpZ2h0LWhvdXNlLWFkbWluLWFwcCIsImxpZ2h0LWhvdXNlLWV4dGVuc2lvbiJdLCJleHAiOjE3MjU3MzcxNjN9.DsWzd8zUCiW7YliUbvxcueV9EwYSkNZ9gJdJnC5XBaHlxgVofZH3HwaCXUUCUR_34tTbfGCdmZGjKDS87RJlozqygnP_E4k4uburUpwbPpFMsnqMpsdRSem6MJe9LBhk_MaFWnxZn50IYIYCfqjl3AGVjgBoHfxK2SB9ZXBqZrlkRdcGuC1HUkwQlVPRw0t774NMwsm3BQEKDFF0VIsMz9Jsv_8RxVIpIv8Iw1LC2kVEmICdB1Mej4AhYWvP48Xo-NIyvQMzq-zOcbIsbDWmXXx98LFXLTHKccfB-axXBGUCMGFshosB26sALfKUdtFbKtrF52S-SILciiYSET8ZRA';

export const predictionApiSlice = createApi({
  reducerPath: 'api/prediction',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Prediction'],

  endpoints: (builder) => ({
    prediction: builder.mutation({
      query: (formData) => ({
        url: `/v1/predictions`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Prediction']
    }),
    getPredictions: builder.mutation({
      query: (formData) => ({
        url: `/v1/predictions/search`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Prediction']
    }),
    getPrediction: builder.query({
      query: (id: string) => `/v1/predictions/${id}`,
      providesTags: ['Prediction']
    })
  })
});

export const {
  usePredictionMutation,
  useGetPredictionsMutation,
  useGetPredictionQuery
} = predictionApiSlice;
