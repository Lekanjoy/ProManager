import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const isActionTriggeredSlice = createSlice({
  name: "isActionTriggered",
  initialState,
  reducers: {
    setActionTriggered: (state, action) => action.payload,
  },
});

export const { setActionTriggered } = isActionTriggeredSlice.actions;
export default isActionTriggeredSlice.reducer;
