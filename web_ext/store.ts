import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "@src/pages/panel/store/apiquery/AuthApiSlice";
import { userSlice } from "@src/pages/panel/store/userSlice";
import { predictionApiSlice } from "@src/pages/panel/store/apiquery/predictionsApiSlice";
import { reviewsApiSlice } from "@src/pages/panel/store/apiquery/reviewsApiSlice";
import { usersApiSlice } from "@src/pages/panel/store/apiquery/usersApiSlice";

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [predictionApiSlice.reducerPath]: predictionApiSlice.reducer,
    [reviewsApiSlice.reducerPath]: reviewsApiSlice.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    user: userSlice.reducer,
    predictions: predictionApiSlice.reducer,
    reviews: reviewsApiSlice.reducer,
    users: usersApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      predictionApiSlice.middleware,
      reviewsApiSlice.middleware,
      usersApiSlice.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
