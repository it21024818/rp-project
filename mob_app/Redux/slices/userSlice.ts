import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserReduxState = {
  [x: string]: any;
  tokens?: Partial<{ accessToken: string; refreshToken: string }>;
  user?: Partial<{
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  }>;
};

export const userSlice = createSlice({
  name: "user",
  initialState: {} as UserReduxState,
  reducers: {
    setUser: (state, action: PayloadAction<UserReduxState>) => {
      state = action.payload;
      return state;
    },
    logoutCurrentUser: (state) => {
      state = {};
      return state;
    },
  },
});

export const { setUser, logoutCurrentUser } = userSlice.actions;
