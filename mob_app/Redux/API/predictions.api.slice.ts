import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../utils/Genarals";

// Function to get token from AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    return token;
  } catch (error) {
    console.error("Error retrieving token from AsyncStorage:", error);
    return null;
  }
};

export const predictionApiSlice = createApi({
  reducerPath: "api/prediction",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getToken();
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
