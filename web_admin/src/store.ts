import { configureStore } from '@reduxjs/toolkit';
import { authApiSlice } from './store/apiquery/AuthApiSlice';
import { userSlice } from './store/userSlice';
import { predictionApiSlice } from './store/apiquery/predictionsApiSlice';
import { reviewsApiSlice } from './store/apiquery/reviewsApiSlice';
import { feedbackApiSlice } from './store/apiquery/feedbackApiSlice';
import { usersApiSlice } from './store/apiquery/usersApiSlice';
import { newsApiSlice } from './store/apiquery/newsApiSlice';

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [predictionApiSlice.reducerPath]: predictionApiSlice.reducer,
    [reviewsApiSlice.reducerPath]: reviewsApiSlice.reducer,
    [feedbackApiSlice.reducerPath]: feedbackApiSlice.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    [newsApiSlice.reducerPath]: newsApiSlice.reducer,
    user: userSlice.reducer,
    predictions: predictionApiSlice.reducer,
    reviews: reviewsApiSlice.reducer,
    feedbacks: feedbackApiSlice.reducer,
    usersDetails: usersApiSlice.reducer,
    news: newsApiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      predictionApiSlice.middleware,
      reviewsApiSlice.middleware,
      feedbackApiSlice.middleware,
      usersApiSlice.middleware,
      newsApiSlice.middleware
    )
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
