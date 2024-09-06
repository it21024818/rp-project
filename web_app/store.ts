import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./src/store/apiquery/AuthApiSlice";
import { userSlice } from "./src/store/userSlice";
import { predictionApiSlice } from "./src/store/apiquery/predictionsApiSlice";

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [predictionApiSlice.reducerPath]: predictionApiSlice.reducer,
    user: userSlice.reducer,
    predictions: predictionApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      predictionApiSlice.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
