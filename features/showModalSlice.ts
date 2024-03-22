import { createSlice } from "@reduxjs/toolkit";

const showModalSlice = createSlice({
  name: "collapse",
  initialState: false,
  reducers: {
    toggleModal: (state) => {
      return !state;
    },
  },
});
export const { toggleModal } = showModalSlice.actions;

export default showModalSlice.reducer;
