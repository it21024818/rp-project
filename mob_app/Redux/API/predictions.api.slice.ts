import { PredictionDto } from "../../types/types";
import { baseApi } from "./base.api.slice";

const predictionApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrediction: builder.mutation<PredictionDto, string>({
      query: (text) => ({
        url: `/predictions`,
        method: "POST",
        body: {
          text,
          url: "http://detect-lighthouse.mobile",
        },
      }),
    }),
    getPrediction: builder.mutation<PredictionDto, string>({
      query: (id) => ({
        url: `/predictions/` + id,
        method: "GET",
      }),
    }),
    getPredictions: builder.mutation<
      { content: PredictionDto[]; metadata: any },
      {
        pageNum: number;
        pageSize: number;
        userId: string;
      }
    >({
      query: ({ pageNum, pageSize, userId }) => ({
        url: `/predictions/search`,
        method: "POST",
        body: {
          pageNum,
          pageSize,
          sort: {
            field: "createdAt",
            direction: "desc",
          },
          filters: {
            createdBy: {
              operator: "EQUALS",
              value: userId,
            },
          },
        },
      }),
    }),
  }),
});

export const { useCreatePredictionMutation, useGetPredictionsMutation } =
  predictionApiSlice;
