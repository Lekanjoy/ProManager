import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { teamData, taskDataObj } from "../types";
import { createClient } from "@/utils/supabase/client";
import { getTeamData } from "@/hooks/getTeamData";

const supabase = createClient();

export const fetchInitialData = createAsyncThunk(
  "newTask/fetchInitialData",
  async () => {
    // Get Current User
    const {
      data: { user },
    } = await supabase.auth.getUser();

   return await getTeamData(user) as teamData;
  }
);

const addNewTaskSlice = createSlice({
  name: "newTask",
  initialState: {
    tasks: [] as teamData[],
    selectedTask: {} as taskDataObj,
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
        state.tasks = [action.payload];
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        console.error("Error fetching initial data:", action.error);
      });
  },
});

export const { addNewTask, selectTask } = addNewTaskSlice.actions;

export default addNewTaskSlice.reducer;
