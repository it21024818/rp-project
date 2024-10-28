import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import roomReducer from "./slices/roomSlice";
import { baseApi } from "./API/base.api.slice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    room: roomReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((baseApi as any).middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
