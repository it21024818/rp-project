import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",

  initialState: {} as any,

  reducers: {
    setUser: (state, action) => {
      state = action.payload;

      return state;
    },

    // setRoomID: (state, action) => {
    //   state.roomId = action.payload;
    //   return state;
    // },

    logoutCurrentUser: (state) => {
      state = {};
      return state;
    },
  },
});

export const { setUser, logoutCurrentUser } = userSlice.actions;
