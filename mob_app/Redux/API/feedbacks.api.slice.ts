import { FeedbackDto } from "../../types/types";
import { baseApi } from "./base.api.slice";

const feedbackApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFeedback: builder.mutation<
      void,
      { predictionId: string; feedback: FeedbackDto }
    >({
      query: ({ predictionId, feedback }) => ({
        url: `/feedback?prediction-id=${predictionId}`,
        method: "POST",
        body: feedback,
      }),
    }),
    getFeedbackByPredictionId: builder.query<void, { predictionId: string }>({
      query: ({ predictionId }) => ({
        url: `/predictions/${predictionId}/feedback`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateFeedbackMutation,
  useLazyGetFeedbackByPredictionIdQuery,
} = feedbackApiSlice;
export default feedbackApiSlice;
