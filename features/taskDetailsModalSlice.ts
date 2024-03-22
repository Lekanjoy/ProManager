import { createSlice } from "@reduxjs/toolkit";

const taskDetailsModalSlice = createSlice({
  name: "detailsModal",
  initialState: false,
  reducers: {
    toggleModal: (state) => {
      return !state;
    },
  },
});
export const { toggleModal } = taskDetailsModalSlice.actions;

export default taskDetailsModalSlice.reducer;
