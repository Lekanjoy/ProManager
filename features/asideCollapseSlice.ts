import { createSlice } from "@reduxjs/toolkit";

const asideCollapseSlice = createSlice({
  name: "collapse",
  initialState: true,
  reducers: {
    collapseAside: (state) => {
      return !state;
    },
  },
});
export const { collapseAside } = asideCollapseSlice.actions;

export default asideCollapseSlice.reducer;
