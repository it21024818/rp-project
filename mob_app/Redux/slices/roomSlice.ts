import { createSlice } from "@reduxjs/toolkit";

const room = createSlice({
  name: "room",
  initialState: {} as Partial<{
    name: string;
    description: string;
    organization: string;
    tag: string;
    adminIds: string[];
    _id: string;
  }>,
  reducers: {
    setRoom: (state, { payload }) => {
      state = payload;
      return state;
    },
  },
});

export const { setRoom } = room.actions;
export default room.reducer;
