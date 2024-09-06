import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
// import { getItem } from "../../Utils/Generals";
// import RoutePaths from "../../config";

const token =
  "eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjU2MTM1MzIsInN1YiI6IjY2ZDVhOTBkNDk1YjBlOWI1N2RkNzIyNiIsImlzcyI6IlVFRSIsImF1ZCI6WyJsaWdodC1ob3VzZS13ZWItYXBwIiwibGlnaHQtaG91c2UtbW9iaWxlLWFwcCIsImxpZ2h0LWhvdXNlLWFkbWluLWFwcCIsImxpZ2h0LWhvdXNlLWV4dGVuc2lvbiJdLCJleHAiOjE3MjU2MjA3MzJ9.FGoHYsmIAos2k5vxXneXMMey7O5NmqbgDunV2sbx7MvnUAEsr8nztQIqtfjH0zmpoNtBaPnvArjZhkIPOmUmz3-ArevueueKonl4hBGLmwfOIgl1mpb8dFdvqxwt4PHGHWTWXDX1MmA8OOr21C1GQBREMwf3IjHi98NFo5n6IRN79m9iPeh8seV4fTGCntHEgwRTGWsWwWTxaSPwxV9U57gU7sXTMRdnyCbTsipU0cwYK6y5_HNt0F44jENXWXwUEtBE-Lm_N3cyYLkiujZtOaPxa_8l2bAY_-io94BapnpRthTDAbXRmvPtMVbuF49RKPi6_s5DQgx8CBpPPps9Vg";

export const predictionApiSlice = createApi({
  reducerPath: "api/prediction",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Prediction"],

  endpoints: (builder) => ({
    prediction: builder.mutation({
      query: (formData) => ({
        url: `/v1/predictions`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Prediction"],
    }),
  }),
});

export const { usePredictionMutation } = predictionApiSlice;
