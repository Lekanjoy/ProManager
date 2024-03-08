import { createSlice, createAsyncThunk, createAction, nanoid } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";

export const fetchInitialData = createAsyncThunk(
  "newTask/fetchInitialData",
  
  async () => {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) {
      throw error;
    }
    return data;
  }
);

export const selectTask = createAction("newTask/selectTask");

const addNewTaskSlice = createSlice({
  name: "newTask",
  initialState: {
    tasks: [],
  },
  reducers: {
    addNewTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload; // Store the selected task
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialData.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export const { addNewTask } = addNewTaskSlice.actions;

export default addNewTaskSlice.reducer;
