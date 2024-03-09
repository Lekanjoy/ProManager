import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";
import { taskDataObj } from "../types";

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


const addNewTaskSlice = createSlice({
  name: "newTask",
  initialState: {
    tasks: [] as taskDataObj[],
    selectedTask: {

    } as taskDataObj,
  },
  reducers: {
    addNewTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    selectTask: (state, action) => {
      return { ...state, selectedTask: action.payload }; // Store the selected task
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        console.error('Error fetching initial data:', action.error);
      });
  }
});

export const { addNewTask, selectTask } = addNewTaskSlice.actions;

export default addNewTaskSlice.reducer;
